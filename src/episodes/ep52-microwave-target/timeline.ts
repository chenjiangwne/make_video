/**
 * ep52 看不见的靶心：微波炉不是坏了，它在炉腔里画了一张靶心（黑金光影风，无口播，120 秒）
 * 锚词「靶心」：8 秒时转盘上浮出那张靶心；96 秒金粒子砸出「靶心」；结尾重新解释它。
 * 配乐为本期程序合成的 120 BPM 段落（audio/episodes/ep52-microwave-target.mjs），
 * 网格从第 0 秒起算：1 小节 = 2 秒，4 拍 = 2 秒，1 拍 = 0.5 秒。
 * 文案骨架来自用户给的大纲：
 *   同一杯牛奶，左边烫嘴，右边温吞 → 微波炉没坏，它画了一张看不见的靶心 → 不信取下转盘放正中
 *   → 转盘不是让热量均匀，是让食物轮流去挨烫 → 下次它转，你可以默默谢它一句
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** 120 BPM：一小节 2 秒，一拍 0.5 秒 */
export const BAR = 2;
export const BAR0 = 0;
export const BEAT = BAR / 4;
export const beatSec = (b: number) => BAR0 + BEAT * b;
export const fr = (sec: number) => Math.round(sec * FPS);
/** 第 b 拍的帧（小节 k 就是 fbt(4k)） */
export const fbt = (b: number) => fr(beatSec(b));
export const fb = (k: number) => fbt(4 * k);

/** 两个爆点：16 秒标题，96 秒锚词 */
export const HIT = fb(8);
export const HIT2 = fb(48);
export const DARK_FROM = fr(14.6);
export const DARK_FROM2 = fr(94.4);
export const FREEZE = 3;
export const DURATION = fr(120);

/** 片中出现的物理量（2.45 GHz 的微波在空气里的波长约 12.2 cm，半个波长 6.1 cm；测试里核对） */
export const MICROWAVE = {freqGHz: 2.45, wavelengthCm: 12.2, halfWaveCm: 6.1};
/** 实验读数只用来说明冷热差，统一标「示意」 */
export const DEMO_TEMP = {centerC: 45, rimC: 75, minutes: 10, note: '示意'};

export const ANCHOR = '靶心';
export const TERM = '驻波 · Standing Wave';
export const TITLE = '看不见的靶心';
export const TITLE_EN = 'The Invisible Bullseye';
export const TITLE_SUB = '同一杯牛奶，左烫右温';
export const QUOTE_1 = '转盘不是让热量均匀，';
export const QUOTE_2 = '是让食物轮流去挨烫。';
export const QUOTE_EN = 'The turntable doesn’t even out the heat. It makes the food take turns getting burned.';

/**
 * 字幕：[拍号, 中文, 英文]。中文不超过 18 字（不算标点、空格和标记）。
 * 【】青 = 术语，〖〗红 = 冷 / 坏，〔〕金 = 数字 / 锚词；null 表示这一段是大字卡，不放字幕。
 */
export const CUES: [number, string | null, string][] = [
  // 钩子：同一杯牛奶，左边烫嘴，右边温吞
  [0, '同一杯牛奶，左边烫嘴，右边温吞。', 'Same glass of milk: the left side scalds, the right is lukewarm.'],
  [8, '我以为，是微波炉坏了。', 'I thought the microwave was broken.'],
  [16, '可它没坏——它画了张看不见的〔靶心〕。', 'It wasn’t. It had drawn an invisible bullseye.'],
  [24, '看不见，但每一圈都在烫你。', 'Invisible, yet every ring burns you.'],
  [32, null, ''], // 标题卡「看不见的靶心」
  // 为什么：驻波和热点
  [36, '微波炉不是火，是一束波。', 'A microwave isn’t fire. It’s a wave.'],
  [40, '波在炉腔里叠成【驻波】。', 'Inside, the waves stack into standing waves.'],
  [44, '波峰烫，波谷凉。', 'Peaks burn. Troughs stay cool.'],
  [48, '热点、凉点，排成一张靶心。', 'Hot spots and cool spots, arranged like a bullseye.'],
  [52, '你站的位置，就是温度。', 'Where it stands is how hot it gets.'],
  [56, '左边一口烫嘴，右边一口温吞。', 'One side scalds, the other is lukewarm.'],
  [60, '不是玄学，是波的形状。', 'Not magic. The shape of a wave.'],
  // 实验：取下转盘放正中
  [64, '不信，取下转盘放正中。', 'Test it: take off the turntable, use the dead center.'],
  [72, '十分钟后，它只是温的。', 'Ten minutes later, it’s only warm.'],
  [80, '因为正中间，常常正好是波谷。', 'Because the center is often a trough.'],
  [88, '热点都散在外圈，一圈一圈。', 'The hot spots sit in the outer rings.'],
  [92, '正中间，反而最容易被忘掉。', 'The center is the spot everyone forgets.'],
  // 转盘：轮流去挨烫
  [96, '转盘一转，杯子开始绕圈。', 'The turntable turns. The cup starts to orbit.'],
  [104, '它穿过热点，再穿过凉点。', 'It crosses hot spots, then cool ones.'],
  [112, '一圈一圈，把滚烫摊平。', 'Lap after lap, the scalding gets spread out.'],
  [120, '所以不是加热更均匀，', 'So it isn’t heating more evenly.'],
  [124, '是让食物轮流去挨烫。', 'It’s making the food take turns.'],
  [128, '靶心没消失，只是被走了一遍。', 'The bullseye never left. It got walked through.'],
  [136, '同一杯牛奶，转一圈，温差就小了。', 'One lap, and the temperature gap shrinks.'],
  [144, '你喝的每一口，都是热和凉的平均。', 'Every sip is hot and cool, averaged.'],
  [152, '转盘不是让热量均匀，', 'The turntable doesn’t even out the heat.'],
  [156, '是让食物〔轮流去挨烫〕。', 'It makes the food take turns getting burned.'],
  // 收束：它没坏，只是不会说话
  [160, '所以，微波炉真的没坏。', 'So your microwave really isn’t broken.'],
  [168, '它只是不会说话，', 'It just can’t explain itself.'],
  [176, '只好在你碗里，画一张靶心。', 'So it draws a bullseye in your bowl.'],
  [184, '而你，一直以为它在加热——', 'And you thought it was just heating —'],
  // 爆点：靶心
  [192, null, ''], // 第二个爆点「靶心」
  [200, '靶心不是故障，是微波的脾性。', 'The bullseye isn’t a fault. It’s the wave’s temper.'],
  [208, null, ''], // 大字卡：转盘不是让热量均匀
  // 结尾
  [224, '下次它转，你可以默默谢它一句。', 'Next time it spins, you can thank it quietly.'],
  [232, '谢它，替你把靶心走了一遍。', 'For walking the bullseye for you.'],
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 话说一半、随收暗退场的一句 */
export const HALF_BEATS = [184];

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, HIT], // 深夜厨房：转盘上的两杯牛奶，靶心浮出
  title: [HIT, fb(10)], // 金粒子聚成「看不见的靶心」
  wave: [fb(10), fb(16)], // 炉腔侧视：驻波、热点、凉点
  experiment: [fb(16), fb(24)], // 取下转盘，杯子放正中：只有温的
  orbit: [fb(24), fb(32)], // 转盘带着杯子穿过热点
  myth: [fb(32), fb(40)], // 不转 vs 转：一半烫一半凉 vs 温得均匀
  build: [fb(40), HIT2], // 回到那杯牛奶，推近靶心，收暗
  hit2: [HIT2, fb(52)], // 「靶心」砸出
  quote: [fb(52), fb(56)], // 大字卡：转盘不是让热量均匀
  end: [fb(56), DURATION], // 结尾：下次它转，默默谢它一句
} as const;

/* ---------------- 靶心布局 ---------------- */

/** 转到这些角度就经过热点（度） */
export const HOT_ANGLES = [18, 70, 122, 168, 214, 262, 308, 350];
/** 靶心半径方向上的热点圈（占外圈半径的比例） */
export const HOT_RADII = [0.4, 0.68];
export const PLATE_R = 300;

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep52-microwave-target';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  // 钩子
  s('impact', 0, 0.5),
  s('slide', 5, 0.35),
  shared('whoosh', 8, 0.18),
  s('chime', 12, 0.35),
  [`${A}/riser.wav`, fr(15), 0.55],
  s('impact', 32, 0.7),
  s('tick', 36, 0.25),
  // 波
  s('tick', 44, 0.22),
  s('chime', 48, 0.35),
  shared('whoosh', 56, 0.2),
  // 实验
  s('impact', 64, 0.4),
  s('slide', 70, 0.35),
  s('beep', 80, 0.4),
  s('ding', 72, 0.4),
  s('beep', 88, 0.3),
  // 转盘
  shared('whoosh', 96, 0.25),
  [`${A}/motor.wav`, fbt(96), 0.32],
  s('tick', 112, 0.25),
  s('tick', 120, 0.25),
  s('impact', 128, 0.45),
  s('tick', 136, 0.22),
  s('chime', 152, 0.32),
  // 收束
  shared('whoosh', 160, 0.25),
  s('tick', 168, 0.2),
  s('tick', 176, 0.2),
  s('tick', 184, 0.2),
  [`${A}/riser.wav`, fr(94.4), 0.6],
  s('impact', 192, 0.7),
  s('tick', 192, 0.3),
  s('chime', 200, 0.4),
  s('impact', 208, 0.45),
  s('tick', 216, 0.2),
  // 结尾
  [`${A}/motor.wav`, fbt(224), 0.22],
  s('chime', 224, 0.35),
  s('ding', 232, 0.45),
];
