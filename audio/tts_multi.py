"""audio/tts_multi.py — 多音色（对话）旁白合成。

按 narration.json 每行的 speaker 选择音色 / 语速 / 音高，用 edge-tts 合成，
转成 48kHz / 16bit / mono wav，并写出与旧流程兼容的 vo_manifest.json。
下游 audio/build_audio.py 无需改动（其只读 manifest 里的 t 与 file）。

用法：
    python audio/tts_multi.py
    python audio/tts_multi.py --list        # 列出本机可用中文音色
"""
from __future__ import annotations

import asyncio
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
VO = ROOT / "projects" / "material" / "vo"
SPEC = ROOT / "audio" / "narration.json"
FFMPEG = r"D:\installpath\Peach\tools\ffmpeg\bin\ffmpeg.exe"
FFPROBE = r"D:\installpath\Peach\tools\ffmpeg\bin\ffprobe.exe"

# 统一音色；设为 None 则按 speaker 映射（VOICES）。当前全片统一用云扬。
UNIFIED_VOICE = "zh-CN-YunyangNeural"

# speaker -> (voice, base_rate_percent, pitch)
# 使用最常用、最自然的官方音色；不做变调（pitch 全为 0），避免"奇怪"的机器感。
VOICES: dict[str, tuple[str, int, str]] = {
    "narrator":   ("zh-CN-XiaoxiaoNeural", 0, "+0Hz"),  # 晓晓：最热门女声，自然
    "caocao":     ("zh-CN-YunjianNeural",  0, "+0Hz"),  # 云健：男声，气势
    "sunquan":    ("zh-CN-YunxiaNeural",   0, "+0Hz"),  # 云夏：少年男声
    "liubei":     ("zh-CN-YunxiNeural",    0, "+0Hz"),  # 云希：温和男声
    "zhouyu":     ("zh-CN-YunyangNeural",  0, "+0Hz"),  # 云扬：播音男声
    "zhugeliang": ("zh-CN-YunxiNeural",    0, "+0Hz"),  # 云希
    "huanggai":   ("zh-CN-YunjianNeural",  0, "+0Hz"),  # 云健
}


def to_wav(mp3: Path, wav: Path) -> None:
    subprocess.run(
        [FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
         "-i", str(mp3), "-ar", "48000", "-ac", "1", str(wav)],
        check=True,
    )


def wav_duration(path: Path) -> float:
    out = subprocess.check_output(
        [FFPROBE, "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)], text=True)
    return float(out.strip().splitlines()[0])


async def synth(line: dict) -> dict:
    speaker = line.get("speaker", "narrator")
    if UNIFIED_VOICE:
        voice, base_rate, pitch = UNIFIED_VOICE, 0, "+0Hz"
    else:
        voice, base_rate, pitch = VOICES.get(speaker, VOICES["narrator"])
    mp3 = VO / f"{line['id']}.mp3"
    wav = VO / f"vo_{line['id']}.wav"

    rate, dur = base_rate, 0.0
    for attempt in range(11):  # base, +5% … +50%，逐步提速直到塞进时间窗
        await edge_tts.Communicate(line["text"], voice,
                                   rate=f"{rate:+d}%", pitch=pitch).save(str(mp3))
        to_wav(mp3, wav)
        dur = wav_duration(wav)
        if dur <= line["win"] or rate >= base_rate + 50:
            break
        rate = base_rate + 5 * (attempt + 1)
    mp3.unlink(missing_ok=True)

    fit = "OK" if dur <= line["win"] else "OVER"
    print(f"  {line['id']} [{speaker:10s}] {voice:22s} rate={rate:+d}% "
          f"t={line['t']:7.2f} win={line['win']:4.1f} dur={dur:5.2f} {fit}", flush=True)
    return {
        "id": line["id"], "t": line["t"], "win": line["win"],
        "speaker": speaker, "voice": voice, "rate": f"{rate:+d}%", "pitch": pitch,
        "text": line["text"], "file": f"vo_{line['id']}.wav",
        "dur": round(dur, 3), "fit": fit,
    }


async def list_voices() -> None:
    voices = await edge_tts.list_voices()
    for v in sorted(voices, key=lambda x: x["ShortName"]):
        if v["ShortName"].startswith("zh-CN"):
            print(f'{v["ShortName"]:34s} {v["Gender"]:6s} {v.get("FriendlyName", "")}')


async def main() -> None:
    if "--list" in sys.argv:
        await list_voices()
        return
    VO.mkdir(parents=True, exist_ok=True)
    spec = json.loads(SPEC.read_text(encoding="utf-8-sig"))
    lines = spec["lines"]
    print(f"synthesizing {len(lines)} lines -> {VO}")
    manifest = []
    for ln in lines:
        manifest.append(await synth(ln))
    (VO / "vo_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    over = [m["id"] for m in manifest if m["fit"] != "OK"]
    print(f"manifest -> {VO / 'vo_manifest.json'}  lines={len(manifest)}  over={len(over)} {over}")


if __name__ == "__main__":
    asyncio.run(main())
