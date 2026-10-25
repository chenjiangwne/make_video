# 视频制作简报 · import.md

> **用途**：你只需要给「分镜脚本」，我按本项目（Remotion + React + SVG）做成视频。
> **默认交付**：无音轨 MP4（1920×1080 / 30fps / H.264 / 烧中文字幕 / 黑金光影风）。
> **可选**：口播（TTS 或真人）、BGM、音效、字幕导出、封面——这些由 `config.json` 记录，但** config 目前是草案、还没接入代码**；实际开关以 `PERSONALREADME.md` §10 / §15 为准。
> **当前示例产物**：`products/one/ep53-national-debt*.mp4`（180 秒国债选题，含无音轨版 / 有音轨版 / 口播版）。

---

## 0. 默认规格（不用填，除非要改）

| 项目 | 默认值 | 说明 |
|---|---|---|
| 画幅 | 1920×1080（16:9） | 也可 1080×1920、1080×1440 |
| 帧率 | 30fps | 本项目统一 30fps，先别改 |
| 时长 | 由分镜时长相加 | 不写总时长也可以 |
| 风格 | 黑金光影风 | 其他可选：暗金文献、战术屏、灯火史话、网点档案 |
| 字幕 | 烧中文字幕 | 每行 ≤18 字，最多两行；中英双语请注明 |
| 音频 | **默认无音轨** | 口播 / BGM / 音效按 §2 开启 |
| 封面 | 不生成 | 需要时另说 |
| 输出 | `products/<slot>/<slug>-noaudio.mp4` | 当前 ep53 的 slot 是 `one` |

---

## 1. 唯一必填：分镜脚本

把分镜贴在下面。表格、纯文本、直接聊天里发都可以；我会整理成 `timeline.ts` 的 `SHOTS` / `CUES`。

### 格式 A：表格示例

| 镜号 | 时长 | 画面（画什么 / 元素顺序 / 镜头） | 屏幕文字 / 字幕 | 旁白原文（可选） | 转场 / 强调 |
|---|---|---|---|---|---|
| S01 | 3s | 黑底，金色粒子聚成标题 | 标题：一句反常识的话 |  | 冷开场 |
| S02 | 5s | 俯视一杯牛奶，左侧红光、右侧青光 | 同一杯牛奶，左边烫，右边温 |  | 左侧推近 |
| S03 | 4s | 转盘旋转，杯子依次穿过红点 | 它不是加热均匀，是轮流挨烫 |  | 卡点闪白 |

### 格式 B：纯文本示例

```text
S01｜3s
画面：黑底，金色粒子聚成标题。
字幕：一句反常识的话。
强调：冷开场。

S02｜5s
画面：俯视一杯牛奶，左侧红光、右侧青光。
字幕：同一杯牛奶，左边烫，右边温。
强调：左侧推近。
```

### 填写规则

- **时长**：每个镜头 2–8 秒；全片时长 = 所有镜头相加，不用自己算帧。
- **字幕**：一行不超过 18 个汉字；一句太长就拆成两个镜头或两条字幕。
- **画面**：写「观众看到什么」即可，不用写代码；元素顺序、重点、镜头运动写清楚。
- **不需要**写绝对时间码、BPM、旁白音频、TTS 音色；想指定也可以写。
- 如果只给旁白、没给画面：也可以，我会补分镜。
- 事实、数字、引用请给准确口径；画面里会标「示意」或出处。

---

## 2. 可选：音频、字幕与风格

| 项目 | 可选项 | 默认 | 现在怎么实现 |
|---|---|---|---|
| 口播 | 无 / TTS / 真人录音 | 无 | TTS：`audio/tts_lines.py` + `voice-plan.json`；真人：`voice.wav` + SRT |
| BGM | 无 / 程序生成 / 变体 / 外部授权曲 | 无 | `audio/episodes/<期>.mjs`；变体见 `audio/bgm-variants.mjs`；外部曲见 `audio/music.mjs` |
| 音效 | 无 / 开 | 开 | `timeline.ts` 的 `SFX` 表 + `audio/sfx-tactical.mjs` |
| 字幕 | 烧录 / 只导出 srt / 两者 / 无 | 烧中文 | 组件 `captions` prop；`subtitles.mjs` 导出 |
| 画面风格 | 黑金 / 暗金 / 战术屏 / 灯火 / 网点 / 其他 | 黑金 | `src/library/<风格>/` |
| 画幅 | 16:9 / 9:16 / 3:4 | 16:9 | Composition 的 `width/height` |
| 视觉节奏 | 按句 / 按拍（120 BPM） | 按句 | `timeline.ts` 的 `BAR/BEAT` |
| 指定锚词 | 例如「靶心」「账单」 | 我来定 | `ANCHOR` |
| 封面 | 要 / 不要 | 不要 | `CoverTall.tsx` + `remotion still` |

> 无音轨时 BPM 只决定剪辑点 / 重音，不会生成音乐。开启 BGM 后，BPM 要和配乐一致；改 BPM 必须同时重排 `timeline.ts`。

### 2.1 口播开关

- **无**：只做画面 + 字幕；需要的话另出无音轨 MP4。
- **TTS**：读 `CUES`/`voice-plan.json`，用 `edge-tts` 逐句合成，塞进 4 秒窗口；当前试听用云扬 `zh-CN-YunyangNeural`。
- **真人**：给 `voice.wav`（48 kHz / 立体声 / 约 −16 LUFS）+ SRT；我用 `Show` / `cues` 对齐。
- 注意：TTS 适合试听 / 内部版；正式发布建议真人录音，并确认音色授权。

### 2.2 BGM / 音效开关

- BGM 关：`mix` prop 或混音时去掉 BGM。
- 音效关：`mix` prop 或从 `timeline.ts` 的 `SFX` 表移除。
- 只要音频：`--codec=wav`；只要画面：`--muted`。
- 现有 BGM 引擎是 120 BPM；`bgm.mjs` 只有 `bright / light / groove / tense / break / end` 六种段落。其他风格要自己改编曲或放授权曲。

---

## 3. 我会怎么落地

| 你的输入 | 本项目对应物 |
|---|---|
| 分镜 / 时长 | `src/episodes/<期>/timeline.ts` 的 `SHOTS` |
| 屏幕文字 / 字幕 | `timeline.ts` 的 `CUES` + `BGCaption` |
| 画面描述 | `src/episodes/<期>/scenes.tsx` |
| 风格 | `src/library/<风格>/` |
| 片名 / 锚词 | `TITLE` / `TITLE_SUB` / `ANCHOR` |
| 口播 | `voice.wav` / `voice-plan.json` + `audio/tts_lines.py` |
| BGM | `audio/episodes/<期>.mjs` 的 `sections` |
| 音效 | `timeline.ts` 的 `SFX` |
| 注册 | `src/Root.tsx` |
| 配置草案 | `config.json`（未接入；见 `PERSONALREADME.md` §14） |

**无音轨**：主组件不放人声，渲染加 `--muted`；交付前 `ffprobe` 确认只有 video stream。

---

## 4. 交付清单

| 产物 | 规格 |
|---|---|
| 无音轨 MP4 | 1920×1080 / 30fps / H.264 / yuv420p / **无 audio stream** |
| 有音轨 MP4（可选） | 上面 + BGM / 音效 / 口播的混音 |
| 口播 / 混音 wav（可选） | 48 kHz 立体声，与画面 0 起点对齐 |
| 字幕 | 烧录，或 `srt` / `字幕稿.md` |
| 封面 | 只有要求时才给（3:4 PNG） |
| 位置 | `products/<slot>/`；当前 ep53 是 `products/one/` |

验收：

```powershell
ffprobe -v error -show_entries stream=codec_type -of default=nw=1 products\one\<slug>-noaudio.mp4
# 期望只看到 codec_type=video

ffprobe -v error -show_entries format=duration -of default=nw=1 products\one\<slug>.mp4
```

---

## 5. 验收标准

- [ ] 时长 = 所有镜头时长之和（±1 帧）
- [ ] 无音轨版没有 audio stream（不是静音轨）
- [ ] 字幕不超出安全区，一行 ≤18 字，最多两行
- [ ] 镜头首尾相接，没有黑帧 / 空帧
- [ ] 关键数字、年份、引用与文案一致；示意画面有标记
- [ ] 风格统一（配色、字体、发光强度、转场一致）
- [ ] 输出文件名和路径符合约定

---

## 6. 不需要提供的东西

- 配音 / TTS / 音色：不强制；想加口播再给。
- 配乐 / 音效：不强制；不给就用程序合成或静音。
- 三轨音频：不强制；只有做口播版时才需要。
- BPM：不强制；要按拍剪再给。
- 字体：除非指定；指定就把文件放 `public/fonts/` 并给授权。
- 素材授权：只有用真实图片 / 视频时才需要。

---

## 7. 复用与迭代

- **复用**：每期都是 `timeline.ts`（镜头 + 字幕 + SFX）→ `scenes.tsx`（画面）→ `Root.tsx`（注册）→ 渲染。
- **迭代**：只改分镜 → 更新 `SHOTS` / `CUES` / 场景 → 抽帧自查 → 重渲。不要同时改三处时间。
- **音频**：口播 / BGM / 音效是三个独立开关，可任意组合；当前 ep53 有 TTS 口播、BGM 变体和完整混音。
- **防冲突**：`config.json` 是草案，不是命令；实际真源见 `PERSONALREADME.md` §15。

---

## 8. 现在你可以直接这样发我

```text
片名：<可选>
风格：黑金光影（默认）/ 暗金 / 战术屏 / 其他
口播：无（默认）/ TTS / 真人
BGM：无（默认）/ 程序生成 / 变体 / 外部曲

S01｜4s
画面：……
字幕：……

S02｜5s
画面：……
字幕：……
```

我会按这个模板落地；默认先交无音轨 MP4，需要口播 / 音轨再按 `config.json` 和现有命令加。
