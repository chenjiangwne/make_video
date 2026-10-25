"""audio/build_audio.py — 纯合成配乐 / 音效 / 混音（numpy + scipy）

不使用任何采样或音乐生成模型：全部由振荡器、噪声、包络、滤波与卷积混响构成。
三条独立音轨（与 180s 视频时间线严格对齐，不混入 MP4）：
  projects/product/audio/01_vo.wav         旁白（干声，原始音色）
  projects/product/audio/02_music_sfx.wav  配乐 + 音效
  projects/product/audio/03_ambient.wav    环境背景声
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy import ndimage, signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[1]
MAT = ROOT / "projects" / "material"
PROD = ROOT / "projects" / "product"
VO_DIR = MAT / "vo"
PROD_AUDIO = PROD / "audio"
SR = 48000
DUR = 180.0
N = int(SR * DUR)
rng = np.random.default_rng(208)

# ── 基础工具 ──────────────────────────────────────────────────────────────
def env_from_points(points, n=N, smooth_ms=12.0):
    """折线包络：[(t, v), ...] → 长度 n 的数组（线性插值 + 一极点平滑）"""
    ts = np.array([p[0] for p in points], float)
    vs = np.array([p[1] for p in points], float)
    x = np.arange(n) / SR
    e = np.interp(x, ts, vs)
    k = 1.0 - np.exp(-1.0 / (smooth_ms / 1000.0 * SR))
    return signal.lfilter([k], [1, -(1 - k)], e).astype(np.float32)


def ad_env(dur, attack=0.005, decay=1.0, sr=SR):
    n = max(2, int(dur * sr))
    a = max(1, int(attack * sr))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 1.5
    tail = np.exp(-np.linspace(0, 6 / max(0.05, decay), n - a))
    e[a:] = tail
    return e


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="bandpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, f, btype="lowpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype="highpass", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def add(buf, t, sig, gain=1.0):
    """把 sig 叠加到 buf 的 t 秒处（立体声/单声道自适应）"""
    i = int(t * SR)
    if i >= buf.shape[0]:
        return
    n = min(sig.shape[0], buf.shape[0] - i)
    if sig.ndim == 1 and buf.ndim == 2:
        buf[i:i + n, 0] += sig[:n] * gain
        buf[i:i + n, 1] += sig[:n] * gain
    else:
        buf[i:i + n] += sig[:n] * gain


# ── 音色 ──────────────────────────────────────────────────────────────────
def tone_drone(freq, dur, detune=0.0, harmonics=(1, 0.5, 0.28, 0.12)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k, amp in enumerate(harmonics, start=1):
        y += amp * np.sin(2 * np.pi * freq * k * (1 + detune) * t + rng.uniform(0, 6.28))
    return y / sum(harmonics)


def taiko(dur=0.9, f0=110, f1=46, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    body *= np.exp(-t * 5.2)
    click = hp(rng.normal(0, 1, n), 1500) * np.exp(-t * 45) * 0.5
    return (body * 0.9 + click) * amp


def wood_click(dur=0.22, freq=1400, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), freq * 0.7, freq * 1.6) * np.exp(-t * 32)
    body = np.sin(2 * np.pi * 320 * t) * np.exp(-t * 26) * 0.5
    return (noise * 1.6 + body) * amp


def pluck(freq, dur=1.4, amp=1.0):
    """拨弦：泛音叠加 + 快速起音 + 指数衰减（不用 Karplus-Strong 采样）"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k in range(1, 7):
        a = 1.0 / (k ** 1.55)
        y += a * np.sin(2 * np.pi * freq * k * t + k * 0.7) * np.exp(-t * (2.6 + k * 1.1))
    att = np.minimum(1.0, t / 0.004)
    return y * att * amp * 0.5


def paper_stroke(dur=0.16, amp=1.0, bright=2600):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), bright * 0.5, bright * 1.9)
    e = np.exp(-t * 26) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
    return noise * e * amp


def wind(dur, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = lp(rng.normal(0, 1, n), 520, order=2)
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * 0.08 * t + 0.4) * np.sin(2 * np.pi * 0.021 * t)
    return noise * lfo * amp


def firesound(dur, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    base = bp(rng.normal(0, 1, n), 180, 2200)
    crackle = np.zeros(n)
    idx = rng.integers(0, n - 2000, size=int(dur * 7))
    for i in idx:
        crackle[i:i + 900] += rng.normal(0, 1, 900) * np.exp(-np.arange(900) / 140)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.17 * t)
    return (base * 0.35 * lfo + crackle * 0.25) * amp


def reverse_swell(dur=1.5, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), 260, 3600)
    e = (t / dur) ** 3.2
    return noise * e * amp


def reverb_ir(dur=1.5, decay=3.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * decay)
    ir = lp(ir, 5200)
    ir[:80] = 0
    return ir / np.max(np.abs(ir))


def apply_reverb(x, wet=0.22, ir=None):
    ir = ir if ir is not None else reverb_ir()
    left = signal.fftconvolve(x[:, 0], ir)[: x.shape[0]]
    right = signal.fftconvolve(x[:, 1], np.roll(ir, 137))[: x.shape[0]]
    out = np.stack([left, right], 1)
    return x * (1 - wet) + out * wet * 0.9


# ── 配乐结构 ──────────────────────────────────────────────────────────────
def build_music():
    """低动态叙事型氛围：低频铺底 + 稀疏木击/拨弦 + 克制的脉冲。72 BPM。"""
    music = np.zeros((N, 2))
    BPM = 72.0
    beat = 60.0 / BPM

    # 1) 低频铺底（D 羽/宫 五声：D A D + 泛音）
    drone_parts = [(36.71, 0.9), (73.42, 1.0), (110.0, 0.55), (146.83, 0.4)]
    drone = np.zeros(N)
    for f, a in drone_parts:
        seg = tone_drone(f, DUR, detune=rng.uniform(-0.0009, 0.0009))
        drone += a * seg
    drone /= 2.85
    # 极缓的音量呼吸
    tt = np.arange(N) / SR
    breath = 0.72 + 0.28 * np.sin(2 * np.pi * 0.017 * tt + 1.2)
    drone *= breath

    # 铺底随段落变化
    drone_env = env_from_points([
        (0, 0.0), (10, 0.55), (12, 0.62), (28, 0.6), (55, 0.66), (85, 0.72),
        (118, 0.8), (124.4, 0.85), (124.6, 0.25), (127, 0.7), (145, 0.62),
        (163, 0.45), (175, 0.42), (178.5, 0.34), (180, 0.0)
    ])
    music[:, 0] += drone * drone_env * 0.5
    music[:, 1] += drone * drone_env * 0.5 * 0.96

    # 2) 低频脉冲：只在推进段（85–145）出现，克制
    t = 85.0
    while t < 145.0:
        amp = 0.30 if t < 118 else 0.36
        if 124.4 < t < 127.0:
            amp *= 0.25  # 转折后留白
        add(music, t, taiko(0.75, 96, 44, amp * 0.8))
        t += beat * 2

    # 3) 关键转折的重音（全片最重的一击）
    add(music, 124.45, taiko(1.5, 132, 40, 1.0))
    add(music, 124.45, taiko(1.1, 78, 34, 0.55))
    # 转折前的反向渐强
    add(music, 123.0, reverse_swell(1.45, 0.32))
    # 火船冲阵的第二次打击（弱一档）
    add(music, 130.7, taiko(1.0, 110, 42, 0.55))
    # 开场悬念句的一记低沉短击
    add(music, 6.1, taiko(0.8, 92, 46, 0.34))

    # 4) 稀疏拨弦：五声音阶，用于人物与解释段落
    scale = [146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 329.63]
    pluck_times = [
        (12.6, 0, 0.30), (15.5, 2, 0.26), (18.7, 4, 0.28), (23.0, 1, 0.24),
        (28.9, 3, 0.30), (31.8, 0, 0.26), (34.8, 5, 0.28), (38.6, 2, 0.24),
        (41.0, 4, 0.26), (46.6, 1, 0.28), (51.2, 0, 0.26), (53.6, 3, 0.22),
        (67.6, 4, 0.24), (72.9, 2, 0.22), (78.4, 0, 0.24),
        (109.2, 3, 0.22), (114.5, 5, 0.2),
        (145.8, 0, 0.3), (149.5, 2, 0.26), (152.0, 1, 0.24), (157.2, 3, 0.26),
        (163.6, 0, 0.26), (166.5, 4, 0.22), (168.2, 2, 0.22), (172.0, 0, 0.2),
        (175.4, 2, 0.26), (177.6, 0, 0.2)
    ]
    for tt0, deg, amp in pluck_times:
        add(music, tt0, pluck(scale[deg] * (0.5 if deg > 3 else 1.0), 1.8, amp))

    # 5) 环境风声：只在转折与结尾，很轻
    add(music, 117.0, wind(16.0, 0.16))
    add(music, 172.0, wind(8.0, 0.10))

    # 6) 混响（短尾，避免糊）
    music = apply_reverb(music, wet=0.18)
    return music


# ── 音效 ──────────────────────────────────────────────────────────────────
def build_sfx():
    sfx = np.zeros((N, 2))

    # 纸笔声：只在画面有明显落笔/圈点处，音量低，不是每一笔都响
    paper_times = [
        0.25, 0.75, 1.15, 3.95, 4.65, 5.40, 8.65, 10.55, 17.15, 17.75,
        20.15, 21.75, 23.55, 26.80, 29.10, 30.10, 35.10, 41.10, 46.90,
        55.90, 62.10, 85.95, 88.10, 90.60, 96.40, 103.10, 110.40,
        118.60, 120.20, 132.20, 136.70, 145.90, 151.90, 168.30, 175.20
    ]
    for i, t in enumerate(paper_times):
        add(sfx, t, paper_stroke(0.14 + 0.04 * (i % 3), 0.30, 2400 + (i % 4) * 350))

    # 木击：时间轴节点 / 姓名签落位
    for t in [20.5, 21.9, 23.4, 24.9]:
        add(sfx, t, wood_click(0.2, 1500, 0.42))
    for t in [30.6, 36.6, 42.6, 48.4]:
        add(sfx, t, wood_click(0.24, 1150, 0.34))

    # 地图路线绘制：轻微纸面滑动
    add(sfx, 88.0, wind(5.2, 0.10))
    add(sfx, 95.0, wind(3.0, 0.07))

    # 重要地点被圈出：一次柔和木击
    add(sfx, 97.4, wood_click(0.3, 900, 0.30))

    # 火：从火船冲阵开始，低音量铺底
    add(sfx, 130.6, firesound(11.0, 0.20))
    add(sfx, 141.0, firesound(4.5, 0.12))

    # 转折重音的音效层（与配乐重音同步，最多两层）
    add(sfx, 124.45, reverse_swell(1.2, 0.22))
    add(sfx, 124.45, wood_click(0.5, 620, 0.34))

    sfx = apply_reverb(sfx, wet=0.14, ir=reverb_ir(1.1, 4.2))
    return sfx


# ── 环境背景声 ────────────────────────────────────────────────────────────
def build_ambient():
    """环境铺底：空气声 + 缓慢风声 + 极低频底噪，全程不间断、低音量。"""
    air = lp(rng.normal(0, 1, N).astype(np.float32), 420, order=2)
    rumble = lp(rng.normal(0, 1, N).astype(np.float32), 90, order=2)
    gust = wind(DUR, 1.0)
    tt = np.arange(N) / SR
    slow = 0.6 + 0.4 * np.sin(2 * np.pi * 0.013 * tt + 0.7)
    bed = air * 0.5 * slow + gust * 0.55 + rumble * 0.9
    bed = bed / (np.max(np.abs(bed)) + 1e-9)
    # 立体声：右声道延迟 6ms，轻微去相关，听感更宽
    right = np.roll(bed, int(0.006 * SR))
    st = np.stack([bed, right], 1).astype(np.float32)
    # 首尾淡入淡出，避免爆音
    fi, fo = int(1.0 * SR), int(2.0 * SR)
    st[:fi] *= np.linspace(0, 1, fi)[:, None]
    st[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return st


# ── 旁白与混音 ────────────────────────────────────────────────────────────
def build_vo():
    vo = np.zeros(N)
    manifest = json.loads((VO_DIR / "vo_manifest.json").read_text(encoding="utf-8-sig"))
    for line in manifest:
        path = VO_DIR / line["file"]
        sr, data = wavfile.read(path)
        if data.dtype == np.int16:
            x = data.astype(np.float32) / 32768.0
        else:
            x = data.astype(np.float32)
        if x.ndim > 1:
            x = x.mean(1)
        assert sr == SR, f"{path} sample rate {sr} != {SR}"
        # 旁白保持干声：不滤波、不加混响，与 TTS 试听完全一致
        add(vo, line["t"], x.astype(np.float32))
    vo_st = np.stack([vo, vo], 1)
    return vo_st


def ducking_curve(vo, depth_db=7.0, attack=0.12, release=0.9):
    """旁白出现时把配乐压低约 7 dB，之后平缓恢复（平滑包络，不切音）"""
    mono = np.abs(vo).mean(1)
    win = max(1, int(0.03 * SR))
    power = ndimage.uniform_filter1d(mono, win, mode="nearest")
    pos = power[power > 1e-5]
    thresh = np.percentile(pos, 55) if pos.size else 0.01
    active = (power > thresh * 0.55).astype(np.float32)
    # 上升快、下降慢：两级一极点滤波近似
    k_a = 1.0 - np.exp(-1.0 / (attack * SR))
    k_r = 1.0 - np.exp(-1.0 / (release * SR))
    fast = signal.lfilter([k_a], [1, -(1 - k_a)], active)
    slow = signal.lfilter([k_r], [1, -(1 - k_r)], active)
    sm = np.maximum(fast, slow * 0.92)
    sm = np.clip(sm, 0, 1)
    depth = 10 ** (-depth_db / 20.0)
    return (1.0 - (1.0 - depth) * sm).astype(np.float32)


def rms(x):
    return float(np.sqrt(np.mean(x ** 2) + 1e-12))


def normalize_to_rms(x, target_db):
    cur = rms(x)
    if cur < 1e-6:
        return x
    return x * (10 ** (target_db / 20) / cur)


def main():
    print("vo ...")
    vo = build_vo()
    print("music ...")
    music = build_music()
    print("sfx ...")
    sfx = build_sfx()
    print("ambient ...")
    ambient = build_ambient()

    PROD_AUDIO.mkdir(parents=True, exist_ok=True)

    # 三条独立音轨，不做任何混合；旁白只做整体增益，不改音色
    def peak_norm(x, target_db):
        pk = float(np.max(np.abs(x))) or 1.0
        return np.clip(x * (10 ** (target_db / 20.0) / pk), -1, 1).astype(np.float32)

    vo = peak_norm(vo, -1.0)                     # 1) 旁白：干声，峰值 -1 dBFS
    music_sfx = peak_norm(music + sfx, -6.0)     # 2) 配乐 + 音效，峰值 -6 dBFS
    ambient = normalize_to_rms(ambient, -40.0)   # 3) 环境背景，RMS -40 dBFS
    ambient = np.clip(ambient, -1, 1).astype(np.float32)

    tracks = [("01_vo.wav", vo),
              ("02_music_sfx.wav", music_sfx),
              ("03_ambient.wav", ambient)]
    for name, data in tracks:
        wavfile.write(PROD_AUDIO / name, SR, (data * 32767).astype(np.int16))
        print(f"  product/audio/{name}  rms={20*np.log10(rms(data)+1e-9):6.1f} dBFS  "
              f"peak={20*np.log10(np.max(np.abs(data))+1e-9):5.1f} dBFS  "
              f"dur={data.shape[0]/SR:.3f}s")


if __name__ == "__main__":
    main()
