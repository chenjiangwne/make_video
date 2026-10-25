#!/usr/bin/env python
"""audio/tts_lines.py — 按 voice-plan.json 生成一条对齐时间线的口播轨。

用法：
  python audio/tts_lines.py products/one/voice-plan.json products/one \
      --voice zh-CN-YunyangNeural --duration 180

plan 每行：{id, start, end, window, text}（秒）。脚本会：
1. 用 edge-tts 逐句合成，必要时提高语速塞进时间窗；
2. 转 48kHz / 16bit / mono；
3. 把所有句子按 start 叠进一条 48kHz / 16bit / stereo 的 voice.wav；
4. 输出 voice-manifest.json（每句实际时长 / 语速 / 是否 fit）。

需要：pip install edge-tts；ffmpeg / ffprobe 在 PATH。
这是“把字幕当旁白”的快速方案；正式口播建议真人录音 + SRT。
"""
from __future__ import annotations

import argparse
import asyncio
import json
import subprocess
import tempfile
import wave
from array import array
from pathlib import Path

import edge_tts

SR = 48000


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        text=True,
    )
    return float(out.strip().splitlines()[0])


def to_wav(src: Path, dst: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-ar", str(SR), "-ac", "1", "-sample_fmt", "s16", str(dst)],
        check=True,
    )


async def synth_line(line: dict, voice: str, work: Path, max_rate: int) -> dict:
    text = line["text"]
    window = float(line["window"])
    target = max(0.4, window * 0.94)
    best = None
    for rate in range(0, max_rate + 1, 5):
        mp3 = work / f"{line['id']}.mp3"
        wav = work / f"{line['id']}.wav"
        await edge_tts.Communicate(text, voice, rate=f"{rate:+d}%").save(str(mp3))
        to_wav(mp3, wav)
        dur = ffprobe_duration(wav)
        best = (rate, dur, wav)
        if dur <= target:
            break
    rate, dur, wav = best
    atempo = 1.0
    if dur > window * 0.98:
        atempo = min(1.3, dur / (window * 0.96))
        fixed = work / f"{line['id']}-fit.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-filter:a", f"atempo={atempo:.3f}", str(fixed)], check=True)
        wav = fixed
        dur = ffprobe_duration(wav)
    return {
        **line,
        "voice": voice,
        "rate": rate,
        "atempo": round(atempo, 3),
        "dur": round(dur, 3),
        "fit": dur <= window + 0.02,
        "wav": str(wav),
    }


def read_mono(path: Path) -> array:
    with wave.open(str(path), "rb") as w:
        assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, path
        return array("h", w.readframes(w.getnframes()))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("outdir")
    ap.add_argument("--voice", default="zh-CN-YunyangNeural")
    ap.add_argument("--duration", type=float, default=180)
    ap.add_argument("--max-rate", type=int, default=50)
    args = ap.parse_args()

    plan = json.loads(Path(args.plan).read_text(encoding="utf-8"))
    out = Path(args.outdir)
    out.mkdir(parents=True, exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix="tts-lines-"))

    async def run():
        rows = []
        for i, line in enumerate(plan, 1):
            row = await synth_line(line, args.voice, work, args.max_rate)
            rows.append(row)
            print(f"[{i}/{len(plan)}] {line['id']} {row['dur']:5.2f}s win={line['window']:.1f}s rate={row['rate']:+d}% atempo={row['atempo']:.2f} {row['fit'] and 'OK' or 'OVER'}", flush=True)
            await asyncio.sleep(0.08)
        return rows

    rows = asyncio.run(run())

    total = int(round(args.duration * SR))
    voice = array("h", [0]) * (total * 2)
    fade = int(0.02 * SR)
    for row in rows:
        samples = read_mono(Path(row["wav"]))
        n = len(samples)
        start = int(round(float(row["start"]) * SR))
        for i in range(n):
            v = samples[i]
            if i < fade:
                v = int(v * i / fade)
            elif i > n - fade:
                v = int(v * (n - i) / fade)
            idx = 2 * (start + i)
            if idx + 1 >= len(voice):
                break
            a = voice[idx] + v
            b = voice[idx + 1] + v
            voice[idx] = 32767 if a > 32767 else -32768 if a < -32768 else a
            voice[idx + 1] = 32767 if b > 32767 else -32768 if b < -32768 else b

    voice_path = out / "voice.wav"
    with wave.open(str(voice_path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(voice.tobytes())

    manifest = [{k: v for k, v in r.items() if k != "wav"} for r in rows]
    (out / "voice-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    over = [r["id"] for r in rows if not r["fit"]]
    print(f"wrote {voice_path} ({args.duration}s, {len(rows)} lines)")
    print(f"over-window: {over if over else 'none'}")


if __name__ == "__main__":
    main()
