# 输出配置 · ep54 国家债务爆雷

> 本文件是 `products/one/story-board/` 的交付约定。以后这一期只产出下面这些文件，不再额外生成 `music.mp4`、`voice-mix.wav`、封面等未列出的文件。
> 目录：`D:\RobotTest\workspace\weilanx-claude-videos\products\one\story-board\`

## 固定交付物

| 文件名 | 内容 | 规格 |
|---|---|---|
| `voice.mp4` | 成片：口播 + BGM + 音效 + 烧中文字幕 | 1920×1080 / 30fps / H.264 + AAC / 180s / 约 −16 LUFS / 峰值 ≤ −1 dBTP |
| `noaudio.mp4` | 无音轨版：只有画面 + 烧中文字幕 | 1920×1080 / 30fps / H.264 / **没有 audio stream** / 180s |
| `pilot-voice.wav` | 口播单独一条（名字沿用你给的 `pilot-voice`） | 48kHz / 16bit / 立体声 / 180s |
| `音效.wav` | 音效单独一条 | 48kHz / 16bit / 立体声 / 180s |
| `bgm.wav` | 配乐单独一条 | 48kHz / 16bit / 立体声 / 180s |
| `ep54-pilot.srt` | 字幕 SRT（中英双语，按口播时间） | UTF-8 |
| `ep54-pilot-subtitles.md` | 字幕稿（序号 / 时间 / 中文 / 英文） | UTF-8 |
| `voice-plan.json` | 口播计划（id / start / end / window / text） | UTF-8 |
| `voice-manifest.json` | 实际口播结果（时长 / 语速 / 是否 fit） | UTF-8 |

## 不再默认输出

- `music.mp4`（无人声版）
- `voice-mix.wav`（口播 + BGM + 音效混音）
- 3:4 封面
- 单独的 `video-only` / 测试帧

如果以后要这些，再单独说明。

## 声音约定

- 口播：`pilot-voice.wav`；响度约 −17 至 −18 LUFS。
- 配乐：`bgm.wav`；约 −16 LUFS。
- 音效：`音效.wav`；峰值约 −6 dBFS。
- 最终 `voice.mp4`：BGM 在说话时侧链闪避，整体约 −16 LUFS，峰值 ≤ −1 dBTP。
- `noaudio.mp4` 用 Remotion `--muted` 渲染，确保没有 audio stream，而不是静音音轨。

## 时间与命名

- 时间源：`story_board.txt` → `voice-plan.json` → SRT / 字幕 / 画面 / 音效。
- 片长：180 秒（= 5400 帧 @30fps）。
- 试片存档在 `products/one/pilot-40s/`；正式交付目录 `story-board/` 只放上表这些文件。
- 文件名严格按上表；`音效.wav` 用中文名，其余用 ASCII。

## 渲染与验收

```powershell
# 无音轨视频
npx.cmd remotion render src/index.ts ep54-national-debt-story products/one/story-board/noaudio.mp4 --muted --concurrency=8 --crf=18

# 口播版：先渲染 noaudio，再与混音 mux
ffmpeg -y -i products/one/story-board/noaudio.mp4 -i <混音.wav> -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart products/one/story-board/voice.mp4

# 验收：noaudio 只有 video stream；voice.mp4 有 video + audio
ffprobe -v error -show_entries stream=codec_type -of default=nw=1 products/one/story-board/noaudio.mp4
ffprobe -v error -show_entries stream=codec_type -of default=nw=1 products/one/story-board/voice.mp4
```

- 口播 / 字幕 / 画面 / 音效同一时间轴；不允许各自一套时间。
- 旁白尽量保留 `story_board.txt` 原句；只按标点拆字幕，不改写、不删词。
- 字幕每行 ≤18 字；超过就拆，不压字号。
