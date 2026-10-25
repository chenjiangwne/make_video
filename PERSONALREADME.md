# PERSONAL README · weilanx-claude-videos

> 本地路径：`D:\RobotTest\workspace\weilanx-claude-videos`
> 项目本质：**用 Remotion + React + SVG 写代码做视频**，不是剪辑软件。画面、字幕、配乐、音效、封面都可以由代码生成。
> 当前状态：已 `npm install`；已跑通 `ep52-microwave-target`（120s）和 `ep53-national-debt`（180s，含 TTS 口播 / BGM 变体 / 无音轨版）；Node 24 / npm 11 / ffmpeg 9；Windows 本机没有也不需要 Python 虚拟环境（Node 依赖全部在项目内 `node_modules`）。根目录的 `config.json` 是**未接入代码的配置草案**，见 §14。

---

## 0. TL;DR

| 问题 | 结论 |
|---|---|
| 项目结构 | `src/library`（可复用画面组件）+ `src/episodes`（每期代码）+ `audio`（配乐 / 音效）+ `styles`（风格配方）+ `.claude/skills`（一键工作流）+ `scripts`（目录 / 导出 / 字幕） |
| 做视频要输入什么 | 最少：一个选题或一份大纲。无口播风格再给配乐（或让代码合成）；口播风格再给人声 wav + SRT；蒸馏风格再给参考视频 |
| 会输出什么 | 成片 mp4、3:4 封面、发布文案、字幕稿 / srt；口播期数另有分轨 stems（人声 / 配乐 / 音效）；Studio 预览 |
| DIY 上限 | 上限就是 React/SVG/Canvas 的能力：换文案 → 换镜头 → 新组件 → 新风格 kit → 新解说语法，五层都能改 |
| 风格能不能变 | 能。8 套现成 kit + 多套配方卡 + 35 种艺术风格 + 9 种解说语法；还能用蒸馏 skill 从参考视频拆一套新风格 |
| 能不能批量做相似风格 | 能。仓库本身就是 50+ 期同风格变体；复用同一套 kit + timeline 骨架，每题只换选题、文案、事实和 1 个专属视觉锚点 |
| 怎么运行 | 见 §10。PowerShell 里用 `npm.cmd` / `npx.cmd`；先 `npm install` → 生成音频 → Studio 预览或直接 render |
| 需要联网吗 | 见 §11。安装依赖、首次下载渲染浏览器、Google Fonts 风格、TTS / 研究需要；装好并缓存后，ep52 / ep53 可离线渲染（TTS 生成除外） |
| 音视频能分开吗 | 能。`--muted` 出无声视频，`--codec=wav` 出音频，`--props` 控制字幕 / 配乐 / 音效；ep53 还额外有 TTS 口播、完整混音和 BGM 变体 |
| 主要文件 | 见 §13。最常改 `timeline.ts` / `scenes.tsx` / `Root.tsx` / `audio/episodes/*.mjs` |
| 配置在哪 | 根目录 `config.json`（**草案，未接入代码**；字段见 §14）；实际真源见 §15 |
| 口播 / BGM 现状 | ep53 有云扬 TTS 口播；BGM 变体在 `products/one/bgm-variants/`；见 §12 / §14 |

---

## 1. 项目结构

```
weilanx-claude-videos/
├─ src/
│  ├─ index.ts                 Remotion 入口
│  ├─ Root.tsx                 所有 Composition / Still 的注册表（手动注册，不自动扫描）
│  ├─ library/                 跨期复用素材库（不能 import episodes）
│  │  ├─ Show.tsx              口播视频骨架
│  │  ├─ cues.ts               makeCues / cf / cw / cueAt，把 SRT 变成帧号
│  │  ├─ character/ items/ sets/  角色、道具、场景（矢量 / 像素）
│  │  ├─ blackgold/            黑金光影风 kit：stage / props / charts / pen / target
│  │  ├─ tactical/             战术屏 HUD kit
│  │  ├─ lamplight/            灯火史话 kit
│  │  ├─ warm-desk/            暖纸工作台 kit
│  │  ├─ gilded/               暗金文献 kit
│  │  ├─ halftone/             网点档案 kit
│  │  ├─ editor-room/          协作剪辑台 kit
│  │  ├─ vox/                  Vox 拼贴 / 时间轴 kit
│  │  └─ previews/             每个 kit 的预览 Composition（library-*）
│  ├─ episodes/                一期一个目录，作品 ID = 目录名
│  │  └─ ep52-microwave-target/
│  │     ├─ timeline.ts        全片唯一时间表（120 BPM、字幕、镜头、音效、事实常量）
│  │     ├─ Ep52Microwave.tsx  主组件：Audio + 场景 + 字幕 + 暗场 + 颗粒
│  │     ├─ scenes.tsx         分镜画面
│  │     └─ CoverTall.tsx      3:4 封面
│  └─ ...
├─ audio/
│  ├─ synth.mjs                14 个通用音效合成
│  ├─ bgm.mjs                  120 BPM 程序化编曲（bright / light / groove / tense / break / end）
│  ├─ music.mjs                从 public/music/ 截曲、淡入淡出、响度归一
│  ├─ sfx-tactical.mjs / sfx-lamplight.mjs
│  └─ episodes/epXX-*.mjs      每期配乐 + 专属音效的段落表
├─ styles/
│  ├─ 我的风格/                成品风格配方卡（黑金、战术屏、灯火、暖纸、暗金、网点、协作剪辑台、矢量 / 像素手绘、像素贴纸等）
│  ├─ 艺术风格/                35 种艺术风格参考
│  └─ 解说语法/                9 种解说语法参考
├─ .claude/skills/             8 个 Claude Code 工作流（一键成片 / 蒸馏风格）
├─ scripts/
│  ├─ ep-dir.sh                按风格建 materials/out 目录并自动编号
│  ├─ export.sh                导出成片 + 封面 / 文案 / 字幕
│  ├─ mix-stems.sh             人声 / 配乐 / 音效分轨混音 + 限幅
│  └─ srt2json.mjs             SRT → cues.json
├─ public/
│  ├─ fonts/                   站酷快乐体等 OFL 字体
│  ├─ music/                   只有 README，mp3 不随仓库分发
│  ├─ audio/                   运行后生成（不进 git）
│  ├─ footage/ images/         真实素材位置，仓库不带
│  └─ ...
├─ tests/                      vitest：素材库 + 每期卡点 / 字幕 / 事实 / 音效
├─ docs/assets/                README 里的风格预览图
├─ package.json / remotion.config.ts / tsconfig.json / vitest.config.ts
├─ AGENTS.md / CLAUDE.md       工程约定（动画必须是帧号的纯函数等）
└─ README.zh-CN.md / PERSONALREADME.md / config.json
```

### 一条视频的数据流

```
选题 / 大纲 / 口播稿
   ↓
timeline.ts（无口播：拍号 + CUES + SHOTS + SFX + 事实常量）
或 cues.json（口播：SRT → cf(n) / cw(n, '词')）
   ↓
scenes.tsx / library 组件（画面 = f(帧号)，随机只用 rand(seed)）
   ↓
Root.tsx 注册 Composition
   ↓
Remotion 逐帧渲染 + 内部混音
   ↓
ffmpeg 导出 / 分轨重混 / 抽封面
```

**关键认知**：这里没有「时间线轨道」和「拖拽」。所谓做视频，就是写一个 `timeline.ts` 和几段 React/SVG 场景，然后让 Remotion 一帧一帧画出来。

---

## 2. 做视频：输入什么，输出什么

### 2.1 两条生产线

| | A. 无口播 / 音乐-only | B. 口播 |
|---|---|---|
| 代表风格 | 黑金光影、战术屏、灯火史话、暗金文献 | 暖纸工作台、Vox、像素贴纸、矢量 / 像素手绘 |
| 时间表 | 每期一个 `timeline.ts`，卡配乐拍子 | `Show` + SRT，`cf(n)` / `cw(n, '词')` 挂字幕 |
| 人声 | 不需要 | 需要 `public/audio/<期>/voice.wav`（48 kHz / 立体声 / 约 −16 LUFS） |
| 字幕 | 直接写进 `CUES`（中英双语） | 由 SRT 导入成 `cues.json` |
| 配乐 | 必需（we-never 或自己的曲子；也可用 `bgm.mjs` 程序合成） | `audio/episodes/<期>.mjs` 按人声包络自动闪避 |
| 素材 | 基本纯代码 | 可有真实照片 / 录屏 / 真人出镜 |
| 输出 | 成片、封面、文案、字幕稿 / srt | 成片、封面、文案、字幕稿、stems 分轨 |

### 2.2 最小输入清单

**无口播（以黑金 / 战术屏为例）**
- 必需：**一个选题**，或一份用户大纲。例如这次的「微波炉中间为什么不热，左边烫嘴右边温吞」。
- 可选：时长（默认约 2 分 17 秒；我们这期压到 120 秒）、标题、锚词、配乐文件、参考视频、封面文案。
- 配乐：优先放一首**有授权**的 mp3 到 `public/music/`，在 `audio/music.mjs` 的 `TRACKS` 登记；没有就自己用 `bgm.mjs` 合成一条（这次 ep52 就是合成的 120 BPM 曲）。

**口播（以暖纸 / Vox / 像素贴纸为例）**
- 必需：选题或口播稿 + **人声录音 / TTS**（wav / mp3）+ **SRT 字幕**。
- 可选：真人出镜录像、照片、录屏、产品截图、本期高亮词。
- 仓库**不带**作者的私人配音 / 声音克隆 / 标题公式；换成任意 TTS、真人录音、任意语音识别即可。

**蒸馏新风格**
- 输入：`template/` 里的参考视频（别人的作品，git 忽略）。
- 不需要文案；skill 会拆镜头、关键帧、配色、运动强度、拍子，再重写组件。

**手动做一期**
- 输入：上面任意一套 + 你自己写的 `timeline.ts` / 场景代码。

### 2.3 标准流程

**无口播（手动版）**
1. 建目录：`bash scripts/ep-dir.sh epXX-topic materials --new 09-黑金光影风 中文短题`（Windows 用 Git Bash / WSL；也可以手动建 `src/episodes/epXX-topic`）。
2. 写 `timeline.ts`：拍号网格、`HIT` / `HIT2`、`CUES`、`SHOTS`、事实常量、`SFX`。
3. 写 `audio/episodes/epXX-topic.mjs`：段落表 + 本期专属音效，运行 `node audio/episodes/epXX-topic.mjs`。
4. 写 `scenes.tsx` / 主组件：优先复用 `src/library/<风格>/`，只为本期设计 1–3 个专属元素。
5. 在 `src/Root.tsx` 注册 Composition（和 3:4 Still 封面）。
6. 写 `tests/episodes/epXX-topic.test.ts`：卡点 ±2 帧、片长、字幕 ≤18 字 / 中英都有、镜头首尾相接、音效在片长内、事实复算。
7. `npx.cmd remotion still ... --frame=N --scale=0.4` 抽帧自查 → `npx.cmd vitest run` → `npx.cmd tsc -p . --noUnusedLocals`。
8. 渲染：`npx.cmd remotion render src/index.ts <期> <输出>.mp4 --concurrency=8 --crf=18`。

**黑金一键版**：直接给「黑金风做一期：XXX」，skill `weilanx-creator-blackgold-video` 会自己查资料 → 定锚词 → 写卡点时间表 → 合成音效 → 设计画面 → 测试 → 自动抽帧 / 测响度 → 导出 → 出封面 / 文案 / 双语字幕，中途不停。

**口播版**：写稿 / 录音 → 标准化到 −16 LUFS → SRT → `npm run cues` → 新建 `cues.ts` / `Show` 配置 → 场景挂在 `cf/cw` 上 → 导出 + 分轨重混。

### 2.4 输出清单

| 产物 | 位置 | 说明 |
|---|---|---|
| 成片 mp4 | `out/<风格>/<编号-中文短题>/<期>.mp4`（`export.sh`） | 默认 1920×1080 / 30fps；竖屏期数按 Composition 设置 |
| 3:4 封面 | 同目录 `封面-3x4.png` | 黑金 / 暗金等用代码渲染；部分 skill 用文生图 |
| 发布文案 | 同目录 `发布文案.md` | 标题、描述、话题；部分 skill 还带内部核对 |
| 字幕稿 | 同目录 `字幕稿.md`；黑金另有 `字幕.srt` | 中文 / 双语 |
| 分轨 | `out/.../stems/voice.wav`、`bgm.wav`、`sfx.wav` | 仅口播期数；`mix-stems.sh` 重新混音、限幅 |
| Studio 预览 | `http://localhost:3000/<期>` | 改代码热更新 |
| 测试 / QA | `tests/`；`/tmp/<期>/qa/` | 卡点、字幕、事实、音效、抽帧、响度 |
| 蒸馏新风格 | `src/library/<新风格>/` + `library-<新风格>` 预览 + 配方卡 | 组件、预览、配方三件套 |

### 2.5 这次 ep52 的实际输入 / 输出

**输入**：你给的 5 句大纲 + 「120 秒左右 + 爆款 + 自己挑风格」。
**选择**：黑金光影风；「靶心」做全片视觉锚点。
**输出**：
- `out-demo/ep52-microwave-target.mp4`：120.04 秒、1920×1080、30fps、−16.1 LUFS、−1.4 dBTP、58.2 MB。
- `out-demo/ep52-cover-3x4.png`：1080×1440 封面。
- 代码：`src/episodes/ep52-microwave-target/` + 新素材库组件 `src/library/blackgold/target.tsx`（`WaveTarget` / `MilkGlassG`）。
- 配乐：`audio/episodes/ep52-microwave-target.mjs` 程序合成的 120 BPM 曲 + 本地音效。
- 测试：`tests/episodes/ep52-microwave-target.test.ts`；全量 63 个测试文件 / 322 个测试通过。

---

## 3. DIY 的最大限度在哪里

**一句话：上限是 React / SVG / Canvas 和你的想象力；下限是必须遵守「帧号纯函数」和素材版权。**

### 3.1 五个 DIY 层级

| 层级 | 你能改什么 | 典型耗时 | 适合谁 |
|---|---|---|---|
| L0 文案层 | `CUES` / SRT、字幕高亮、标题、锚词、片长、音量 | 10–30 分钟 | 只想换一期内容 |
| L1 分镜层 | `SHOTS` 顺序、时长、场景组合、镜头推拉、音效表 | 1–3 小时 | 已有风格，想换叙事 |
| L2 组件层 | 在 `src/library/<风格>/` 新写道具、图表、角色、舞台；复用已有组件 | 半天–2 天 | 想加专属画面 |
| L3 风格层 | 新 `theme.ts` + `stage` + `props` + `charts` + 预览 + 配方卡，注册 `library-<新风格>` | 2–7 天 | 想做一套自己的视觉体系 |
| L4 语法层 | 新 `Show` 骨架 / 新 timeline 语法 / 批量生成器 / 新片型 | 1–2 周 | 想做系列、流水线 |

### 3.2 能改到什么程度

- **画面元素**：任何 SVG / HTML / CSS（但不能用 CSS 动画和实时时间）都能画；角色、图表、地图、粒子、光效、3D 感透视都可以手写。
- **镜头**：推、拉、摇、缩放、暗场交叉、硬切、冻结帧、逐帧抖动，都是 `f` 的函数。
- **节奏**：精确到帧；可以卡 BPM、卡小节线、卡重拍、卡字幕词。
- **声音**：程序合成音效、程序编曲、截取授权音乐、按人声包络闪避、分轨重混。
- **封面 / 文案 / 字幕**：都能代码生成或模板化。
- **风格**：不只是换色；可以换整套画面语法（参考视频 → 蒸馏 → 新 kit）。

### 3.3 硬约束（别踩）

1. **动画 = 帧号的纯函数**：不能用 `Math.random()`、CSS animation、`Date.now()`；随机只能用 `rand(seed)`，否则每次渲染都不一样。
2. **`timeline.ts` 不能 import 别的 .ts / .tsx**：`qa.mjs` / `subtitles.mjs` 会用 Node 直接加载它。
3. **`src/library/` 不能 import `src/episodes/`**：素材库必须可复用。
4. **新一期必须手动注册 `src/Root.tsx`**：没有自动扫描；Composition ID = 目录名。
5. **素材版权**：不画真实游戏角色 / 地图 / 枪械 / logo；不用未授权的音乐、影视片段、他人肖像；字体注意 OFL / 系统字体。
6. **口播期数的声音**：仓库不带 `voice.wav`；没有它，Studio 里静音，`npm run audio` 也无法生成该期配乐。
7. **macOS 字体更稳**：黑金中文用 `Songti SC / Noto Serif SC`，Windows 会回退到衬线字体；能看，但字形不完全一致。
8. **不是通用剪辑器**：没有拖拽轨道、没有关键帧 UI、没有素材管理器；加真实视频要自己写 `OffthreadVideo` / `Sequence`。

### 3.4 最推荐的 DIY 路径

- 第一次：从 `ep36-boxed-pigs`（黑金）或 `ep00-demo`（矢量手绘）复制结构，只改 `CUES` 和 `SHOTS`。
- 第二次：把本期专属画面抽到 `src/library/<风格>/`，补 `src/library/README.md`。
- 第三次：按 `styles/我的风格/<风格>/README.md` 的配方卡，做一套自己的 kit + 预览 + 配方。
- 每次只让 **20% 的画面是本期专属**，80% 复用，才能稳定批量。

---

## 4. 视频风格是否可变

**能，而且不止换色。**

### 4.1 现成风格资产

| 资产 | 数量 / 位置 | 用途 |
|---|---|---|
| 可复用 kit | 8 套：`blackgold/ tactical/ lamplight/ warm-desk/ gilded/ halftone/ editor-room/ vox/` | 直接 import 组件 |
| 成品风格配方卡 | `styles/我的风格/`（黑金、战术屏、灯火、暖纸、暗金、网点、协作剪辑台、矢量 / 像素手绘、像素贴纸等） | 看画面特征、节奏、组件、出彩手法 |
| 艺术风格 | 35 种（`styles/艺术风格/`） | 换画风参考（洞穴壁画、蒸汽波等） |
| 解说语法 | 9 种（`styles/解说语法/`） | 换叙事语法（3B1B 数学、Kurzgesagt 插画、白板、Keynote、金融图表、Vox、故事、动态字、出镜） |
| 预览 Composition | `library-*` | Studio 里直接看每种风格 |
| 蒸馏 skill | `weilanx-creator-distill-video` | 参考视频 → 新 kit + 预览 + 配方卡 |

### 4.2 三种换法

1. **换 kit（最常用）**：新一期改 import，从 `blackgold/stage` 换成 `tactical` / `lamplight` 等，重写 `scenes.tsx`。风格语法不同，不是一行配置。
2. **换 look（小改）**：口播 `Show` 有 `look: 'classic' | 'sticker'`；角色有 `CharStyle.Provider value="vector" | "pixel"`；画幅在 Composition 的 `width/height` 改。
3. **蒸馏新风格（大改）**：把参考视频放 `template/`，跑 distill skill；它会拆镜头 / 配色 / 运动 / 拍子，产出 `src/library/<新风格>/`、`library-<新风格>` 预览和配方卡。原则是**风格一比一，内容不搬**。

### 4.3 能混搭吗

能，但要手动：
- 同一期里可以复用不同 kit 的零件（例如黑金的 `GlowCard` + 自己的靶心组件）。
- 不建议 3 套以上语法混在一起；观众会失去「这是什么系列」的认知。
- 混搭的代价是：颜色语义、字体、发光强度、转场节奏都要重新统一，否则会「脏」。

### 4.4 换风格的成本

- 换色 / 换字体：几十分钟。
- 换 kit：半天–2 天（要重写场景）。
- 新 kit：2–7 天（theme + stage + props + charts + preview + 配方 + 测试）。
- 新解说语法：1–2 周（要改骨架和批量模板）。

---

## 5. 能不能批量做「风格相差不大」的视频

**能。这个仓库本身就是 50+ 期同风格变体的集合。**

### 5.1 批量成立的原因

- 每期结构完全一致：`timeline.ts` / `scenes.tsx` / `CoverTall.tsx` / `audio/episodes/*.mjs` / `tests/*.test.ts`。
- 同一套 kit 的组件、配色、字幕、转场、配乐网格可以跨期复用。
- 渲染是确定性的：同一份代码 + 同一帧号 = 同一画面。
- 仓库里的战术屏 ep25–ep51 基本共用一套 `we-never` 网格和 11 下硬拍结构，就是现成的批量案例。

### 5.2 批量 SOP（推荐）

1. **定系列**：选 1 套 kit（例如黑金光影），固定片长、画幅、字幕规则、配色语义、配乐网格。
2. **做模板期**：先做 1 期「母版」，把可复用的舞台、标题卡、字幕、结尾、封面做成组件。
3. **抽数据层**：每题只维护一份数据：选题、锚词、30–36 条 `CUES`、8–12 个 `SHOTS`、事实常量、音效表。
4. **复制骨架**：复制母版的 `timeline.ts` / `scenes.tsx` / 音频脚本 / 测试，改数据，不重新发明结构。
5. **每题 1 个专属锚点**：例如这次的「靶心」；下一题换一个专属图形 / 道具，避免「只换字」的模板感。
6. **注册 + 测试**：`Root.tsx` 加 Composition；测试卡点 / 字幕 / 事实 / 音效。
7. **批量渲染队列**：`npx remotion render` 逐期跑；每期抽 3 帧 + 测响度；通过再导出。
8. **统一封面 / 文案**：同一套封面模板，改标题和锚词。

### 5.3 自动化的瓶颈

- **Root.tsx 手动注册**：目前没有自动扫描；批量 10 期要手动加 10 段。
- **每期测试**：建议批量生成测试骨架，只改事实常量和期望值。
- **配乐**：每期如果用同一首曲子，要重新测 BPM / 重拍；用 `bgm.mjs` 合成则可以固定 120 BPM 网格。
- **渲染时间**：1080p / 30fps 的 120 秒片，本机 `--concurrency=8` 实测约 4 分钟/期；更长、更复杂的 SVG 或竖屏高帧率会更久。批量要排队。
- **存储**：每期 60–200 MB；成片 + 中间帧 + 封面会堆得很快。
- **QA**：自动抽帧只能查「明显崩坏」，字幕语义、事实口径、视觉新鲜度仍要人看。

### 5.4 建议的批量节奏

- 一个风格先做 **5–10 期**，验证「观众会不会腻」再扩。
- 每期保持：**同一套 80% 语法 + 一个 20% 专属视觉锚点**。
- 同一批里至少变化：钩子句、证据 / 实验、锚词图形、结尾情绪落点。
- 不建议「只换字幕」批量；那样画面会像同一模板反复播，完播率会掉。

### 5.5 批量验收清单

- [ ] 卡点：标题 / 锚词 / 重拍 ±2 帧
- [ ] 片长：符合系列规格
- [ ] 字幕：≤18 字、中英都有、爆点留空、锚词首尾出现
- [ ] 镜头：首尾相接，爆点是镜头起点
- [ ] 事实：数字 / 计算在测试里复算，示意画面标「示意」
- [ ] 音效：都在片长内，文件存在，爆点有 impact
- [ ] 响度：约 −16 LUFS，真峰值 ≤ −1 dBTP
- [ ] 抽帧：开头 / 中段 / 爆点 / 结尾无重叠、无空帧
- [ ] 封面 / 文案 / 字幕稿齐全

---

## 6. Windows 本地运行备忘

### 6.1 这个项目没有 Python 虚拟环境

它是 Node / Remotion 项目。依赖装在项目内 `node_modules`，本身就是隔离环境。只有 `analyze.py` / `beats.py` 等分析脚本需要 Python / `uv`，不做风格蒸馏可以不装。

### 6.2 PowerShell 里的坑

- `npm.ps1` / `npx.ps1` 可能被执行策略拦截 → 用 `npm.cmd` / `npx.cmd`，或 `& "C:\Program Files\nodejs\npx.cmd"`。
- `package.json` 的脚本是 Unix 写法（`NODE_OPTIONS=... remotion`、`for f in ...`、`bash scripts/export.sh`），Windows PowerShell 下不能直接跑。
- 建议每条命令前先设：
  ```powershell
  $env:NODE_OPTIONS="--max-old-space-size=4096"
  ```

### 6.3 常用命令对照

| Unix 脚本 | Windows 可用写法 |
|---|---|
| `npm run studio` | `npx.cmd remotion studio src/index.ts` |
| `npm run typecheck` | `npx.cmd tsc -p . --noUnusedLocals` |
| `npm test` | `npx.cmd vitest run` |
| `npm run export -- <期>` | Git Bash 里 `bash scripts/export.sh <期>`；或直接 `npx.cmd remotion render src/index.ts <期> <out>.mp4 --concurrency=8 --crf=18` |
| `npm run audio` | `node audio/synth.mjs`；再逐个 `node audio/episodes/<期>.mjs`（没有配乐的期数会报错，属正常） |
| `npm run cues -- a.srt b.json` | `node scripts/srt2json.mjs a.srt b.json` |
| `bash scripts/ep-dir.sh ...` | 用 Git Bash / WSL；或手动建 `materials/`、`out/`、`src/episodes/` 目录 |
| 抽单帧 | `npx.cmd remotion still src/index.ts <期> out.jpg --frame=N --scale=0.4` |
| 响度检查 | `ffmpeg -i <mp4> -af ebur128=peak=true -f null -` |

### 6.4 本机已验证

- Node `v24.22.1`
- npm `11.19.1`
- Remotion CLI `4.0.529`
- ffmpeg `9.0.2`
- 渲染 120 秒 / 1080p / 3600 帧：`--concurrency=8 --crf=18` 可跑通，实测约 4 分钟
- 最终混音用 ffmpeg `alimiter` 压到 −1.4 dBTP（Remotion 内部混音可能顶到 0 dB）

---

## 7. 素材与版权边界

仓库故意不带：

- 作者的人声录音、真人出镜、照片、录屏；
- `public/music/*.mp3`（只有目录）；黑金 / 战术屏 / 灯火 / 暗金样片用的 `we-never` 不随仓库分发；
- `template/` 参考视频（别人的作品）；
- `materials/`、`out/` 原始素材和成片。

你要自己准备：

- 有授权的配乐；
- 自己 / 已授权的人声；
- 可再分发的图片、视频、字体；
- 引用的事实来源（一手资料，数字进常量并在测试里断言）。

---

## 8. 这次 ep52 的可复用经验

1. **先定视觉锚点，再写分镜**：这期是「靶心」。所有段落（钩子、实验、绕圈、结尾）都回到同一张靶心。
2. **把台词拆成「可截图的一句话」**：`转盘不是让热量均匀，是让食物轮流去挨烫。` 在 76 秒先讲一次，104 秒做成整屏大字卡再砸一次。
3. **用真实生活实验当证据**：取下转盘放正中 → 十分钟只是温的 → 中心常常是波谷。温度读数标「示意」，并注明不同机器靶心不同。
4. **爆点卡在 96 秒**：金粒子 + `GlowSmash` + `TickRing`，之后立刻接大字卡，给观众一个「截图点」。
5. **结尾落情绪，不落知识点**：`下次它转，你可以默默谢它一句。`
6. **新组件沉淀**：`WaveTarget` / `MilkGlassG` 放进 `src/library/blackgold/target.tsx`，下一期讲驻波、热点、转盘、任何「固定图案 + 绕圈」都能直接复用。

---

## 9. 快速开始（本机）

```powershell
cd D:\RobotTest\workspace\weilanx-claude-videos
$env:NODE_OPTIONS="--max-old-space-size=4096"

# 装依赖（已装过可跳过）
npm.cmd install --no-audit --no-fund

# 预览（浏览器打开 http://localhost:3000）
npx.cmd remotion studio src/index.ts

# 生成通用音效 / 本期配乐
node audio/synth.mjs
node audio/episodes/ep52-microwave-target.mjs

# 渲染本期
npx.cmd remotion render src/index.ts ep52-microwave-target out-demo/ep52-microwave-target.mp4 --concurrency=8 --crf=18

# 渲染封面
npx.cmd remotion still src/index.ts ep52-microwave-target-cover-tall out-demo/ep52-cover-3x4.png

# 检查
npx.cmd vitest run
npx.cmd tsc -p . --noUnusedLocals
```

---

---

## 10. 怎么运行

### 10.1 先决条件

- Windows 10 / 11 + PowerShell（本机已验证）
- Node.js 20+（本机 24.22.1）、npm 11+
- ffmpeg 在 PATH 里（本机 9.0.2）
- Git（只用来拉代码）
- 约 1 GB 空闲：`node_modules` + 渲染浏览器 + 成片
- 首次安装 / 首次渲染需要联网；之后 ep52 可以离线

### 10.2 首次运行

```powershell
cd D:\RobotTest\workspace\weilanx-claude-videos

# 1) 装依赖（项目内 node_modules，等价隔离环境）
npm.cmd install --no-audit --no-fund

# 2) 生成通用音效 + 本期配乐 / 音效
node audio/synth.mjs
node audio/episodes/ep52-microwave-target.mjs

# 3) 打开 Studio 预览
$env:NODE_OPTIONS="--max-old-space-size=4096"
npx.cmd remotion studio src/index.ts
```

浏览器打开 `http://localhost:3000/ep52-microwave-target`。
左侧按风格分了 Folder；`ep52-microwave-target-cover-tall` 是封面 Still。

> Studio 里的 `npm run studio` 脚本是 Unix 写法，Windows 直接用上面的 `npx.cmd remotion studio`。  
> 首次渲染会下载 Chrome Headless Shell 到 `node_modules\.remotion\chrome-headless-shell\win64\`，需要联网并等一会儿。

### 10.3 日常运行 / 重渲

```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"

# 主成片（带配乐 + 音效 + 烧字幕）
npx.cmd remotion render src/index.ts ep52-microwave-target out-demo/ep52-microwave-target.mp4 --concurrency=8 --crf=18

# 干净画面（无声、无底部字幕，给后期 DIY）
npx.cmd remotion render src/index.ts ep52-microwave-target out-demo/ep52-clean-1080p.mp4 --muted --props=out-demo/props-clean.json --concurrency=8 --crf=18

# 完整音频（配乐 + 音效）
npx.cmd remotion render src/index.ts ep52-microwave-target out-demo/ep52-audio-full.wav --codec=wav

# 只要音效（配乐静音）
npx.cmd remotion render src/index.ts ep52-microwave-target out-demo/ep52-sfx-only.wav --codec=wav --props=out-demo/props-sfx.json

# 封面
npx.cmd remotion still src/index.ts ep52-microwave-target-cover-tall out-demo/ep52-cover-3x4.png

# 检查
npx.cmd vitest run
npx.cmd tsc -p . --noUnusedLocals
```

`--props` 在 PowerShell 里不要直接写 `'{"captions":false}'`（引号会被吞掉）。用 JSON 文件最稳：

```powershell
'{"captions":false}' | Set-Content -Encoding utf8 out-demo\props-clean.json
'{"mix":"sfx"}'      | Set-Content -Encoding utf8 out-demo\props-sfx.json
```

### 10.3b ep53 口播 / BGM 重跑

```powershell
# 1) 用 39 条字幕生成口播（edge-tts，需要联网）
python audio/tts_lines.py products/one/voice-plan.json products/one --voice zh-CN-YunyangNeural --duration 180

# 2) 人声响度归一
ffmpeg -y -i products/one/voice.wav -af "loudnorm=I=-17:TP=-1.5:LRA=11" -ar 48000 -ac 2 products/one/voice-norm.wav

# 3) 三个 BGM 变体（30 秒试听）
node audio/bgm-variants.mjs

# 4) 混音后 mux 到无音轨视频（BGM 的 sidechain 参数见 §15）
ffmpeg -y -i products/one/ep53-national-debt-noaudio-captions.mp4 -i products/one/ep53-national-debt-voice-mix.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart products/one/ep53-national-debt-voice.mp4
```

### 10.4 常见报错

| 现象 | 原因 / 解决 |
|---|---|
| `npm.ps1 cannot be loaded` | PowerShell 执行策略；用 `npm.cmd` / `npx.cmd` |
| `You passed --props but it was neither valid JSON...` | PowerShell 吞了引号；把 props 写成 JSON 文件，用 `--props=文件路径` |
| `staticFile ... not found` / 渲染报音频 404 | 先跑 `node audio/synth.mjs` 和 `node audio/episodes/<期>.mjs` |
| `Cannot find module 'remotion'` | 没装依赖；在项目根跑 `npm.cmd install` |
| `ffmpeg` 不是内部命令 | 安装 ffmpeg 并加入 PATH；本机是 `C:\Users\user\AppData\Local\Microsoft\WinGet\Packages\...\ffmpeg.exe` |
| 首次 render 卡在下载浏览器 | 需要联网 / 代理；缓存目录 `node_modules\.remotion\chrome-headless-shell\win64\` |
| `NODE_OPTIONS` 里有失效的 `--require` | 重新设 `$env:NODE_OPTIONS="--max-old-space-size=4096"` |
| 渲染出来某几帧发黑 | 分镜之间的淡入淡出；不是丢帧。要硬切就改 `scenes.tsx` 的 opacity 公式 |
| 中文变成方块 / 字形不对 | 系统没有 `Songti SC / Noto Serif SC`；Windows 回退到衬线体。可换字体或装 Noto Serif SC |

### 10.5 怎么找别的作品 / 期数

- `src/Root.tsx` 是 Composition 注册表，所有 ID 都在里面。
- Studio 左栏按 Folder 分：`01-矢量手绘风` … `09-黑金光影风`、`99-素材预览`。
- 素材预览用 `library-*`，例如 `library-blackgold`、`library-tactical`。
- 成片（如果按 `export.sh` 走）在 `out/<风格>/<编号-中文短题>/`。

---

## 11. 需要联网吗

### 11.1 结论

**安装和首次渲染需要；装好、缓存好之后，ep52 可以完全离线渲染。**

### 11.2 分场景

| 操作 | 要联网吗 | 说明 |
|---|---|---|
| `git clone` | 要 | 从 GitHub 拉代码 |
| `npm install` / `npm ci` | 要 | 从 npm registry 装依赖 |
| 第一次 `remotion render` / `studio` | 要 | 下载 Chrome Headless Shell；缓存在 `node_modules\.remotion\` |
| 之后渲染 ep52 / ep53 | **不要** | 字体在 `public/fonts/` / `public/fonts/vox/`，音频本地生成，代码里没有远程 URL |
| Studio 预览 | 不要 | 本地 `localhost:3000` |
| `node audio/synth.mjs` / 本期音频脚本 | 不要 | 纯本地合成 + ffmpeg |
| 渲染封面 | 不要 | 纯代码 |
| 手绘 / 贴纸 / 角色类风格 | **可能要** | `src/library/theme.ts` 用 `@remotion/google-fonts` 在线拉 Google Fonts；第一次或清缓存后需要联网 |
| 黑金 / 暗金 / 战术屏 / 灯火等自有 kit | 不要 | 各自主题用本地 woff 或系统字体；黑金还引了 `vox/theme` 的本地 woff |
| 用黑金 skill 查资料 | 要 | 联网查一手资料；不查资料直接给稿子可以离线 |
| TTS / 声音克隆 / AI 封面 | 看工具 | 云端 API 要联网；本地 TTS 不需要 |
| `analyze.py` / `beats.py` / `uv` | 首次要 | `uv` 首次会下载 Python 依赖；之后可离线 |
| 音乐 / 人声 / 真实素材 | 不要 | 只要文件已经在本机 |

### 11.3 完全离线检查清单

- [ ] `node_modules/` 已安装
- [ ] `node_modules/.remotion/chrome-headless-shell/win64/` 已缓存
- [ ] `public/fonts/` + `public/fonts/vox/` 存在
- [ ] `public/audio/<期>/bgm.wav` 和 `public/audio/sfx/*.wav` 已生成
- [ ] 不用依赖 Google Fonts 的手绘 / 贴纸风格，或已把字体本地化
- [ ] ffmpeg 在 PATH
- [ ] 配乐 / 人声 / 素材都在本机

> 如果必须离线，建议固定用黑金 / 暗金 / 战术屏 / 灯火这几套自带字体的 kit；不要在离线环境第一次渲染手绘 / 贴纸风格。

---

## 12. 音视频分离：单独生成一份给 DIY

### 12.1 ep52 新增的两个 props

| prop | 类型 | 默认 | 作用 |
|---|---|---|---|
| `captions` | boolean | `true` | `false` 时不渲染底部中英双语字幕，输出干净画面 |
| `mix` | `'all' \| 'bgm' \| 'sfx'` | `'all'` | `all` 配乐 + 音效；`bgm` 只要配乐；`sfx` 只要音效（配合 `--codec=wav`） |

> `captions=false` 只关掉底部字幕；章节签、画面里的 HOT/COLD 标签、大字卡和右下角「示意」仍会保留。要完全无字，需要在 `scenes.tsx` 里再加开关。

### 12.2 ep52 已经导出的 DIY 文件（ep53 见 §13.3b）

| 文件 | 规格 | 用途 |
|---|---|---|
| `out-demo/ep52-microwave-target.mp4` | 1920×1080 / 30fps / 120.04s / 58.2 MiB / 有音频 + 烧字幕 | 直接发布 |
| `out-demo/ep52-clean-1080p.mp4` | 1920×1080 / 30fps / 120.0s / 53.9 MiB / **无音频、无底部字幕** | 自己配音、重新配乐、加自己的字幕 |
| `out-demo/ep52-audio-full.wav` | 48 kHz / 立体声 / 120.0s / −16.0 LUFS / −1.5 dBTP | 完整混音：配乐 + 音效 |
| `out-demo/ep52-bgm.wav` | 48 kHz / 立体声 / 120.0s / 约 −16 LUFS | 只要配乐，自己重新混音 |
| `out-demo/ep52-sfx-only.wav` | 48 kHz / 立体声 / 120.0s / −23.1 LUFS / −4.6 dBTP | 只要音效，自己贴到别的画面上 |
| `out-demo/字幕.srt` / `字幕稿.md` | 36 条双语字幕 / 02:00.0 | 给剪辑软件挂字幕，或做多语言 |
| `out-demo/ep52-cover-3x4.png` | 1080×1440 | 封面 |

编辑建议：把 `ep52-clean-1080p.mp4` 和 `ep52-audio-full.wav` 一起拖进剪辑软件，起点都是 0，帧率 30fps，音频 48 kHz，不需要再对齐。

### 12.3 给任意一期做同样的事

**无口播期数（独立 timeline）**
1. 给主组件加 `captions` / `mix` props（照抄 `Ep52Microwave.tsx`）。
2. 渲染无声干净画面：`--muted --props=props-clean.json`。
3. 渲染音频：`--codec=wav`；要分轨就 `{"mix":"bgm"}` / `{"mix":"sfx"}`。
4. 用 ffmpeg 限幅：`alimiter=limit=0.841:level=disabled` → 约 −1.5 dBTP。

**口播期数（走 `Show`）**
- `bash scripts/export.sh <期>` 已经会导出 `stems/voice.wav`、`stems/bgm.wav`、`stems/sfx.wav`，再用 `mix-stems.sh` 重混。
- 只要视频：对成片 `ffmpeg -i <mp4> -an -c:v copy <video-only.mp4>`。
- 只要音频：`ffmpeg -i <mp4> -vn -c:a pcm_s16le <audio.wav>`（从成片抽，会经过 AAC 解码；要无损就用 Remotion `--codec=wav`）。

### 12.4 关于字幕的两种做法

| 做法 | 优点 | 缺点 |
|---|---|---|
| 字幕烧进视频（当前主成片） | 发布省事，平台压缩后也不会丢 | 不能后期改字；做多语言要重渲 |
| 字幕单独文件 + 干净视频 | 可改字、可翻译、可换字体 | 需要自己用剪辑软件或播放器挂字幕 |

黑金 skill 默认还会输出 `字幕稿.md` / `字幕.srt`；这次已经用 `subtitles.mjs` 从 `timeline.ts` 生成到 `out-demo/`（36 条，中英双语）。

---

## 13. 主要文件清单

### 13.1 启动 / 配置

| 文件 | 作用 | 什么时候改 |
|---|---|---|
| `package.json` | 依赖和脚本 | 加依赖 / 改命令 |
| `package-lock.json` | 锁定版本 | 不手改 |
| `remotion.config.ts` | JPEG 质量、并发数等 | 想改渲染默认值 |
| `tsconfig.json` / `vitest.config.ts` | TS / 测试配置 | 一般不动 |
| `src/index.ts` | Remotion 入口 | 一般不动 |
| `src/Root.tsx` | **所有 Composition / Still 注册表** | 每加一期必改（手动） |

### 13.2 素材库（跨期复用）

| 文件 / 目录 | 作用 |
|---|---|
| `src/library/Show.tsx` | 口播视频骨架（背景 / 场景 / 字幕 / 人声 / 配乐 / 音效） |
| `src/library/cues.ts` | `makeCues` → `cf(n)` / `ce(n)` / `cw(n,'词')` / `cueAt` |
| `src/library/anim.ts` | 缓动、`keyframes`、`rand(seed)`、`boil`、`reach` |
| `src/library/theme.ts` | 手绘 / 贴纸基础色 + Google Fonts（联网点） |
| `src/library/fonts.ts` | 站酷快乐体、代码字体 |
| `src/library/Subtitles.tsx` / `ui.tsx` / `fx.tsx` | 字幕条、卡片 / 文字、特效 |
| `src/library/character/` | `Char`、像素小人、配饰、手臂 |
| `src/library/items/` / `sets/` | 道具、场景 |
| `src/library/blackgold/` | 黑金 kit：`theme` / `stage` / `props` / `charts` / `pen` / `target` |
| `src/library/tactical/` | 战术屏 kit |
| `src/library/lamplight/` | 灯火 kit |
| `src/library/warm-desk/` | 暖纸 kit |
| `src/library/gilded/` | 暗金 kit |
| `src/library/halftone/` | 网点 kit |
| `src/library/editor-room/` | 协作剪辑台 kit |
| `src/library/vox/` | Vox kit（本地 woff 在 `public/fonts/vox/`） |
| `src/library/previews/` | `library-*` 预览 Composition |

### 13.3 本期 ep52

| 文件 | 作用 |
|---|---|
| `src/episodes/ep52-microwave-target/timeline.ts` | 120 BPM 网格、`HIT` / `HIT2`、36 条 `CUES`、`SHOTS`、事实常量、`SFX` |
| `src/episodes/ep52-microwave-target/Ep52Microwave.tsx` | 主组件；`captions` / `mix` props；音频、字幕、暗场、颗粒 |
| `src/episodes/ep52-microwave-target/scenes.tsx` | 钩子 / 标题 / 驻波 / 实验 / 绕圈 / 对比 / 收束 / 大字卡 / 结尾 |
| `src/episodes/ep52-microwave-target/CoverTall.tsx` | 3:4 封面 |
| `src/library/blackgold/target.tsx` | 新沉淀组件：`WaveTarget`、`MilkGlassG` |
| `src/episodes/import-demo-noaudio/` | `import.md` 的三镜 12 秒无音轨示例（标题 / 牛奶 / 绕圈） |
| `audio/episodes/ep52-microwave-target.mjs` | 120 BPM 配乐段落表 + beep / ding / slide / motor |
| `tests/episodes/ep52-microwave-target.test.ts` | 卡点 / 片长 / 字幕 / 事实 / 音效测试 |

### 13.3b 本期 ep53

| 文件 | 作用 |
|---|---|
| `src/episodes/ep53-national-debt/timeline.ts` | 180s / 120 BPM、16s 标题、144s 锚词、43 条 `CUES`、`SHOTS`、事实常量、`SFX` |
| `src/episodes/ep53-national-debt/Ep53Debt.tsx` | 主组件；`captions` / `mix` props；音频、字幕、暗场、颗粒 |
| `src/episodes/ep53-national-debt/scenes.tsx` | 欠条 / 三张账单 / 政府 / 银行 / 家庭 / 本币 vs 外币 / 大字卡 / 结尾 |
| `src/episodes/ep53-national-debt/CoverTall.tsx` | 3:4 封面 |
| `src/library/blackgold/bill.tsx` | 新沉淀组件：`BillG`、`WalletG` |
| `audio/episodes/ep53-national-debt.mjs` | 120 BPM 配乐段落表 + impact / riser / tick |
| `tests/episodes/ep53-national-debt.test.ts` | 卡点 / 片长 / 字幕 / 事实 / 音效测试 |
| `products/one/` | ep53 成片 / 无音轨 / 口播 / 音频 / 封面 / 字幕 / BGM 变体 |
| `config.json` | ep53 配置草案（未接入；见 §14） |

### 13.4 音频 / 脚本 / 测试

| 文件 | 作用 |
|---|---|
| `audio/synth.mjs` | 14 个通用音效（whoosh / chime / impact 等） |
| `audio/bgm.mjs` | 120 BPM 程序编曲：`renderArrangement(seconds, sections)` |
| `audio/music.mjs` | 从 `public/music/` 截曲、淡入淡出、响度归一（`cutMusic`） |
| `audio/score.mjs` | 配乐 / 谱面工具 |
| `audio/sfx-tactical.mjs` / `sfx-lamplight.mjs` | 战术屏 / 灯火专属音效包 |
| `audio/episodes/<期>.mjs` | 每期配乐 + 专属音效 |
| `audio/tts_lines.py` | 按 `voice-plan.json` 生成对齐口播轨（edge-tts） |
| `audio/bgm-variants.mjs` | 三个 120 BPM BGM 变体（cinematic / minimal / news） |
| `scripts/ep-dir.sh` | 按风格建 `materials/`、`out/` 目录并编号（bash） |
| `scripts/export.sh` | 导出成片 / stems / 封面 / 文案 / 字幕（bash） |
| `scripts/mix-stems.sh` | 人声 / 配乐 / 音效分轨重混 + 限幅 |
| `scripts/srt2json.mjs` | SRT → `cues.json` |
| `tests/` | 素材库 + 每期测试 |

### 13.5 资产 / 风格 / 文档

| 路径 | 作用 |
|---|---|
| `public/fonts/` | 站酷快乐体等本地字体 |
| `public/fonts/vox/` | Anton / Playfair / EB Garamond / Caveat / Noto Sans SC 的本地 woff |
| `public/audio/` | 运行后生成（不进 git） |
| `public/music/` | 只带 README；mp3 自己放 |
| `public/footage/` / `public/images/` | 真实素材位置，仓库不带 |
| `styles/我的风格/` | 成品风格配方卡（含黑金） |
| `styles/艺术风格/` | 35 种艺术风格参考 |
| `styles/解说语法/` | 9 种解说语法参考 |
| `.claude/skills/` | 8 个 Claude Code 工作流（一键成片 / 蒸馏） |
| `README.zh-CN.md` | 官方中文说明 |
| `AGENTS.md` / `CLAUDE.md` | 工程约定（帧纯函数、目录、音频流水线等） |
| `src/library/README.md` | 素材库目录（新组件要补这里） |
| `PERSONALREADME.md` | 本文件：个人地图 + 运行 / DIY / 批量决策记录 |
| `import.md` | 视频简报模板：分镜必填；口播 / BGM / 音效 / 字幕 / 输出由 config 控制，默认先出无音轨 |
| `config.json` | 配置草案：口播 / BGM / 音效 / 字幕 / 封面 / 输出路径（未接入代码） |
| `products/` | 交付根目录；`products/one/` 是 ep53：有音轨 / 无音轨 / 口播 / 音频 / 封面 / 字幕 / BGM 变体 |
| `out-demo/` | ep52 / ep53 的中间成片 / 封面 / 分离音视频 / props 示例 |

### 13.6 最常改的 10 个文件

1. `src/episodes/<期>/timeline.ts`：字幕、镜头、卡点、事实、音效。
2. `src/episodes/<期>/scenes.tsx`：画面。
3. `src/episodes/<期>/Ep53Debt.tsx`（或对应主组件）：音频 / 字幕开关 / 暗场。
4. `src/episodes/<期>/CoverTall.tsx`：封面。
5. `src/Root.tsx`：注册新一期。
6. `audio/episodes/<期>.mjs`：配乐段落 + 专属音效。
7. `src/library/<风格>/`：新组件 / 新风格。
8. `tests/episodes/<期>.test.ts`：卡点 / 字幕 / 事实断言。
9. `public/music/` + `audio/music.mjs`：换配乐。
10. `src/library/README.md` + `styles/我的风格/<风格>/README.md`：沉淀组件和配方。

---

## 14. config.json（草案，未接入代码）

文件：`config.json`（项目根目录）  
状态：`"status": "draft-not-wired"`、`"applied": false`

它把「下一期视频可能想改的东西」集中到一份 JSON 里：口播、BGM、音效、字幕、封面、渲染参数、输出路径。**目前只是配置草案，渲染代码不会读取它**；实际命令仍以 §10 和 §15 为准。

### 14.1 字段

| 字段 | 内容 |
|---|---|
| `episode` | id / 标题 / 风格 / Composition / 30fps / 1920×1080 / 180s / 120 BPM / 语言 |
| `paths` | episode 目录、timeline、主组件、音频目录、输出目录 |
| 开关 | `voice.enabled` / `bgm.enabled` / `sfx.enabled` / `captions.enabled` / `cover.enabled`；测试在 `qa.runTests` |
| `voice` | `mode: tts / recorded / none`、`mixMode: external`、`source`、`plan`、`manifest`、TTS 音色 / 语速 / 塞窗策略、混音音量、BGM ducking |
| `bgm` | `mode: generated / variant / external`、BGM 源文件、变体源、引擎、段落表、音量、响度 |
| `sfx` | 音效源、`timeline.ts#SFX` 表、音量、生成引擎 / preset / 本地音效 / 共享音效 / 峰值 |
| `captions` | `mode: burned / srt / both / none`、语言、18 字上限、字号 / 位置、srt / md 输出 |
| `cover` | 封面 composition、1080×1440、输出路径 |
| `render` | concurrency / crf / codec / 像素格式 / 音频码率 / 静音渲染 / 各个成品输出路径 |
| `loudness` | 目标 −16 LUFS、真峰值 −1.5 dBTP、limiter |
| `qa` | 测试、无音轨检查、响度检查、抽帧时间点、contact sheet |
| `sourceOfTruth` | 当前谁才是真源（见 §15） |

### 14.2 当前配置里的开关

| 开关 | 现在怎么实现（config 还没接入） |
|---|---|
| 关口播 | 不生成 `voice.wav` / 不在最终混音里加人声；ep53 的组件本身只放 BGM + SFX，人声是外部混音 |
| 关 BGM | 用 `mix` prop 只留 SFX，或在混音时去掉 BGM；`--muted` 是整体静音，不是只关 BGM |
| 关音效 | 用 `mix` prop 只留 BGM，或从 `timeline.ts` 的 `SFX` 表移除；config 的 `sfx.enabled` 暂不生效 |
| 关字幕 | 目前用 `captions` prop（ep52 / ep53 已支持）；config 的 `captions.enabled` 暂不生效 |
| 换输出位置 | 改实际 render / ffmpeg 命令；`render.outputs` 只是未来要读的路径清单 |
| 换音色 | `python audio/tts_lines.py ... --voice zh-CN-YunyangNeural`；config 只是记录 |
| 换 BGM | 改 `audio/episodes/<ep>.mjs`，或把 `bgm-variants` 里的文件换上去；config 只是记录 |

### 14.3 接入 config 时的做法（下一步，不是现在）

1. 写 `scripts/config-lint.mjs`：校验 JSON、episode ID、路径、BPM、时长、输出目录。
2. 写 `scripts/build-episode.mjs`：读 config → 生成 `timeline.ts` / `audio/episodes/<ep>.mjs` / 渲染命令 / 测试骨架。
3. 让组件读 `mix` / `captions` / `voice` 等 prop，删除手工重复的音量 / 路径。
4. 只有当 config 成为唯一入口后，才把 `status` 改成 `applied`。
5. 未接入前，**不要**只改 config 就以为生效。

---

## 15. 防冲突规则（当前逻辑）

### 15.1 现在的真源

| 内容 | 真源文件 |
|---|---|
| 时间、字幕、镜头、`SFX` 表、事实常量 | `src/episodes/ep53-national-debt/timeline.ts` |
| 画面 | `src/episodes/ep53-national-debt/scenes.tsx` |
| 音频开关 / 混音 | `src/episodes/ep53-national-debt/Ep53Debt.tsx` |
| BGM 编曲 | `audio/episodes/ep53-national-debt.mjs` |
| 口播对齐 | `products/one/voice-plan.json` |
| 注册 | `src/Root.tsx` |
| 配置 | `config.json`（草案，未接入） |

### 15.2 规则

1. **一份数据只放一个地方。** 时间 / 字幕 / 音效表在 `timeline.ts`；不要同时改 config 和 timeline 后各自生效。
2. **config 不是命令。** 未接入前，`voice.enabled=false` 不会自动关掉人声。
3. **`import.md` 是内容简报，不是技术配置。** 分镜 / 字幕 / 画面写在 import.md；口播、BGM、音效、输出写在 config / 命令里。
4. **输出路径统一。** 当前 ep53 在 `products/one/`；下一期新建 `products/<slot>/`，不要用 `final-final`。
5. **BPM 必须成对改。** `timeline.ts` 的 `BAR/BEAT` 和 `bgm.mjs` / 外部曲目的 BPM 必须一致；只改 config 的 `bpm` 不会生效。
6. **接入 config 后反向约束。** 一旦写生成器，`timeline.ts` 由 config 生成，禁止再手改生成物；测试要断言生成结果。
7. **口播 / BGM / SFX 是三件事。** 可以只要口播、只要 BGM、只要音效，或全混；不要把「有音轨」等同于「有人声」。
8. **TTS 不是真人。** edge-tts 适合试听 / 内部版；正式发布建议真人录音，并确认音色授权。

### 15.3 想改什么，现在去哪改

| 想改 | 现在改这里 |
|---|---|
| 字幕文字 / 时长 | `timeline.ts` 的 `CUES` / `SHOTS` |
| 画面 | `scenes.tsx` |
| 口播音色 / 语速 | `audio/tts_lines.py --voice ...` + `voice-plan.json` |
| 口播音量 / BGM 闪避 | 混音命令 / `voice-mix.wav` 的 ffmpeg 参数 |
| BGM 情绪 / 段落 | `audio/episodes/ep53-national-debt.mjs` 的 `sections` |
| BGM 变体 | `audio/bgm-variants.mjs`，输出到 `products/one/bgm-variants/` |
| 音效列表 / 音量 | `timeline.ts` 的 `SFX` |
| 字幕开关 | `captions` prop（ep52 / ep53） |
| 音频轨道开关 | `mix` prop (`all / bgm / sfx`) 只控制 BGM / SFX；人声在外部混音里单独加 |
| 成品路径 | 渲染命令 / ffmpeg；未来才是 `config.render.outputs` |
| 封面 | `CoverTall.tsx` + `remotion still` |

---

*这份 README 是个人使用向的「项目地图 + 决策记录」，不是官方文档；官方细节以 `README.zh-CN.md`、`AGENTS.md`、`src/library/README.md` 和 `.claude/skills/` 为准。*
