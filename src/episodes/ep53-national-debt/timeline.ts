/**
 * ep53 国债的账单：一个国家欠债太多，普通人的存款、收入会怎样？
 * 黑金光影风，无口播，180 秒，120 BPM（本项目的程序化配乐网格）。
 * 锚词「账单」：开场一张欠条，16 秒标题，144 秒砸出「账单」；
 * 结构：钩子 → 三张账单 → 政府利息 → 银行—主权循环 → 家庭通胀/利率/就业 → 本币 vs 外币 → 收束。
 * 说明：片中预算比例、价格变化都是「示意」，历史案例只写年份与结果。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const BAR = 2;
export const BAR0 = 0;
export const BEAT = BAR / 4;
export const beatSec = (b: number) => BAR0 + BEAT * b;
export const fr = (sec: number) => Math.round(sec * FPS);
export const fbt = (b: number) => fr(beatSec(b));
export const fb = (k: number) => fbt(4 * k);

export const HIT = fb(8); // 16s 标题
export const HIT2 = fb(72); // 144s 锚词
export const DARK_FROM = fr(14.6);
export const DARK_FROM2 = fr(142.4);
export const FREEZE = 3;
export const DURATION = fr(180);

export const ANCHOR = '账单';
export const TERM = 'Sovereign Debt · 主权债务';
export const TITLE = '国债的账单';
export const TITLE_EN = 'The Debt Bill';
export const TITLE_SUB = '国家欠债，最后谁买单？';
export const QUOTE_1 = '你的存款没有消失，';
export const QUOTE_2 = '只是被重新定价了。';

/** 预算结构只用来说明「利息挤占」，统一标示意 */
export const BUDGET = {interest: 30, education: 22, health: 18, other: 30, note: '示意'};

/** 历史案例：年份和结果都是公开事实；不写具体债务数字，避免口径争议 */
export const CASES = [
  {country: '阿根廷', year: 2001, event: '主权违约 · 存款限制'},
  {country: '黎巴嫩', year: 2019, event: '银行危机 · 存款冻结'},
  {country: '斯里兰卡', year: 2022, event: '主权违约 · 进口崩溃'},
] as const;

/**
 * 字幕：[拍号, 中文, 英文]。中文 ≤18 字（不算标点、空格和标记）。
 * 【】青 = 术语，〖〗红 = 风险 / 坏结果，〔〕金 = 数字 / 锚词。
 */
export const CUES: [number, string | null, string][] = [
  [0, '一个国家欠债太多，会动你的存款吗？', 'Can too much national debt touch your savings?'],
  [8, '通常不会直接没收，但会换一种方式。', 'Usually not by confiscation, but by another route.'],
  [16, '钱不会凭空消失，只会换一个人付。', 'Money does not vanish. Someone else pays.'],
  [24, '账单不会消失，只会往下传。', 'The bill never disappears. It gets passed down.'],
  [32, null, ''], // 标题
  [40, '先看三张账单：政府、银行、家庭。', 'Three bills: government, banks, households.'],
  [48, '政府的利息、银行的资本、你的购买力。', 'Government interest, bank capital, your purchasing power.'],
  [56, '三张账单，一张比一张更靠近你。', 'Three bills, each closer to you.'],
  [64, '第一张：政府的账单。', 'Bill one: the government.'],
  [72, '政府借钱修路、发工资、救经济，', 'Governments borrow to build, pay, and rescue.'],
  [80, '但借来的钱，要付利息。', 'But borrowed money carries interest.'],
  [88, '债务越大，利息越重。', 'The bigger the debt, the heavier the interest.'],
  [96, '利息不创造新东西，只挪走教育医疗。', 'Interest creates nothing; it moves school and hospital money.'],
  [104, '预算被利息挤瘦，公共服务先排队。', 'Interest squeezes the budget; public services queue.'],
  [112, '利息，是预算里最硬的一笔。', 'Interest is the hardest line in the budget.'],
  [120, '第二张：银行的账单。', 'Bill two: the banks.'],
  [128, '银行爱买国债，安全、能抵押。', 'Banks love government bonds: safe and pledgeable.'],
  [136, '国债一跌价，银行资本就有窟窿。', 'When bonds fall, bank capital gets a hole.'],
  [144, '存款人一慌，挤兑就来了。', 'When depositors panic, a run begins.'],
  [152, '银行卖资产，政府再来救。', 'Banks sell assets; the state steps in.'],
  [160, '政府救银行，债务又回到政府。', 'The rescue returns the debt to the state.'],
  [168, '这是【主权—银行循环】。', 'The sovereign-bank loop.'],
  [176, '第三张：你家的账单。', 'Bill three: your household.'],
  [184, '先来的不是没收，是通胀。', 'It starts with inflation, not confiscation.'],
  [192, '同样一百块，买到的东西变少。', 'The same hundred yuan buys less.'],
  [200, '工资追不上物价，存款在变薄。', 'Wages lag prices; savings thin out.'],
  [208, '利率一升，房贷和消费贷更贵。', 'Higher rates make mortgages and loans dearer.'],
  [216, '存款还在，购买力先没了。', 'Savings remain. Purchasing power goes first.'],
  [224, '但有两种债，结局完全不同。', 'But two kinds of debt end very differently.'],
  [232, '借自己的货币，还是借别人的货币？', 'Borrow in your own currency, or someone else’s?'],
  [240, '本币债，政府不会名义上还不起。', 'In local currency, the state need not default nominally.'],
  [248, '它可以用通胀和贬值，把债稀释掉。', 'It can inflate and devalue the debt away.'],
  [256, '外币债，政府真的可能没有美元。', 'In foreign currency, the state can run out of dollars.'],
  [264, '还不上，就是违约、重组、进口崩溃。', 'Then comes default, restructuring, and import collapse.'],
  [272, '阿根廷、黎巴嫩、斯里兰卡，都走过。', 'Argentina, Lebanon, and Sri Lanka have been there.'],
  [280, '极端时，银行会限取、冻结、强制换币。', 'In extremes: withdrawal limits, freezes, forced conversion.'],
  [288, null, ''], // 第二个爆点「账单」
  [304, '国家欠债，先被重新定价的是货币。', 'National debt reprices the currency first.'],
  [312, '最后才是存款、工资和选择权。', 'Savings, wages, and choices come after.'],
  [320, '这张账单，最后落在每个拿钱的人手里。', 'The bill lands with everyone holding money.'],
  [328, null, ''], // 大字卡
  [336, null, ''],
  [352, '下一次，先看你的购买力。', 'Next time, look at your purchasing power first.'],
];
export const cueStart = (i: number) => fbt(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);

/** 镜头：全部落在拍点上、首尾相接 */
export const SHOTS = {
  hook: [0, HIT], // 一张欠条 + 钱包：会动你的存款吗？
  title: [HIT, fb(10)], // 金粒子聚成「国债的账单」
  intro: [fb(10), fb(20)], // 三张账单：政府 / 银行 / 家庭
  gov: [fb(20), fb(30)], // 利息挤占预算
  bank: [fb(30), fb(44)], // 国债跌价 → 银行资本窟窿 → 挤兑
  household: [fb(44), fb(56)], // 通胀 / 利率 / 就业三张收据
  currency: [fb(56), fb(68)], // 本币债 vs 外币债
  build: [fb(68), HIT2], // 欠条滚向镜头，收暗
  hit2: [HIT2, fb(76)], // 「账单」砸出
  aftermath: [fb(76), fb(82)], // 货币先被重新定价
  quote: [fb(82), fb(88)], // 大字卡：存款没有消失
  end: [fb(88), DURATION], // 下一次，先看购买力
} as const;

/** 政府预算柱状图的值（示意，总和 100） */
export const budgetBars = (interest: number): number[] => [interest, BUDGET.education, BUDGET.health, BUDGET.other];

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep53-national-debt';
const s = (name: string, b: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fbt(b), v];
const shared = (name: string, b: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fbt(b), v];
export const SFX: [string, number, number][] = [
  s('impact', 0, 0.5),
  shared('paper', 4, 0.3),
  shared('ding', 8, 0.28),
  s('impact', 32, 0.7),
  s('tick', 36, 0.22),
  shared('whoosh', 40, 0.25),
  shared('paper', 56, 0.28),
  s('impact', 80, 0.45),
  shared('stamp', 88, 0.3),
  s('tick', 96, 0.22),
  s('impact', 120, 0.45),
  s('tick', 136, 0.22),
  s('impact', 176, 0.45),
  s('tick', 184, 0.22),
  s('impact', 224, 0.45),
  s('tick', 232, 0.22),
  [`${A}/riser.wav`, fr(143), 0.6],
  s('impact', 288, 0.7),
  s('tick', 288, 0.3),
  shared('ding', 304, 0.35),
  shared('whoosh', 328, 0.25),
  s('impact', 328, 0.35),
  shared('ding', 352, 0.4),
];
