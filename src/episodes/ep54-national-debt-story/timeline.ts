/**
 * ep54 国家债务爆雷（180 秒）
 * 按 story_board.txt 的完整结构：
 *   0–12 钩子：国家小人 + 欠条堆 + 标题
 *   12–40 两种债：内债 vs 外债
 *   40–74 情景 1：温和稀释（债务山 / 通胀 / 税收 / 购买力缩水）
 *   74–110 情景 2：外债爆雷（外储 / 资本外流 / 汇率暴跌 / 输入性通胀）
 *   110–144 情景 3：债务违约（红叉 / 失去海外融资 / 银行与挤兑风险）
 *   144–164 普通人：三张建议卡
 *   164–176 总结：失控的债务才是
 *   176–180 结尾：下一期 + 点赞关注
 * 旁白按原稿逐句拆字幕，不改写；时间为 0.5 秒精度。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = Math.round(180 * FPS);

export const TITLE = '国家债务爆雷';
export const TITLE_EN = 'When National Debt Blows Up';
export const TITLE_SUB = '普通人会怎样？';
export const KEYWORD = '内债 ≠ 外债';
export const DISCLAIMER = '示意 · 不是投资建议';

export const fr = (sec: number) => Math.round(sec * FPS);

/** CUES：[秒, 中文, English]；cueStart 统一换算成帧 */
const CUE_SECONDS: [number, string, string][] = [
  // 0–12 钩子
  [0, '一个国家欠债太多，到底会发生什么？', 'What happens when a country borrows too much?'],
  [4.2, '很多人最关心的问题只有一个：', 'Most people only care about one thing:'],
  [8, '我的存款、工资，会不会跟着遭殃？', 'Will my savings and wages be hit?'],
  // 12–40 两种债
  [12, '首先要分清两件事：内债和外债，', 'First, separate two things: internal and external debt.'],
  [15.5, '结局完全不一样。', 'They end very differently.'],
  [18, '内债，说白了就是欠自己国民的钱，', 'Internal debt is owed to a country’s own citizens.'],
  [21.5, '国债、地方债都属于这类，', 'Government and local bonds both belong here.'],
  [24.5, '钱还在国内循环。', 'The money keeps circulating at home.'],
  [27, '外债，是欠别的国家、海外资本的钱，', 'External debt is owed to other countries and overseas capital.'],
  [31, '要用外币偿还，', 'It must be repaid in foreign currency.'],
  [33.5, '这才是风险最高的一种。', 'That is the riskiest kind.'],
  // 40–74 情景 1
  [40, '第一种情况，也是大部分大国的选择：', 'The first path, chosen by most large economies:'],
  [43.5, '慢慢拖、慢慢消化。', 'drag it out and slowly digest it.'],
  [47, '通过长期通胀、缓慢增长、收税，', 'Through long-term inflation, slow growth, and taxes,'],
  [51, '用未来的收入稀释债务。', 'future income dilutes the debt.'],
  [55, '这个阶段不会瞬间崩盘，', 'There is no sudden collapse at this stage,'],
  [58.5, '但代价藏在细节里：', 'but the cost hides in the details:'],
  [62, '物价悄悄涨，', 'prices creep up,'],
  [64.5, '钱购买力慢慢变弱，', 'purchasing power slowly weakens,'],
  [67, '存款利息跑不赢通胀。', 'and deposit interest cannot beat inflation.'],
  // 74–110 情景 2
  [74, '第二种，外债爆雷，', 'The second path: external debt blows up,'],
  [77, '也是新闻里看到的经典债务危机。', 'the classic debt crisis seen in the news.'],
  [80.5, '外汇储备不够还债，', 'Foreign reserves are not enough to repay,'],
  [83, '外资疯狂跑路，', 'foreign capital flees,'],
  [85.5, '本国货币大幅贬值。', 'and the currency plunges.'],
  [88.5, '进口商品直接涨价，', 'Imported goods get more expensive,'],
  [91, '油价、粮食、原材料全部变贵。', 'oil, food, and raw materials all cost more.'],
  [94.5, '这时你手里的现金存款，', 'Your cash savings may keep the same number,'],
  [97, '哪怕数字没变，', 'even if the number does not change,'],
  [99.5, '能买到的东西直接变少；', 'but they buy less.'],
  [103, '企业成本暴涨，', 'Corporate costs soar,'],
  [105.5, '裁员、降薪变多。', 'and layoffs and pay cuts increase.'],
  // 110–144 情景 3
  [110, '第三种，直接选择债务违约，', 'The third path: outright default,'],
  [113.5, '简单讲就是公开说：', 'simply telling the world:'],
  [116, '我暂时还不上钱了。', 'I cannot repay for now.'],
  [119, '短期海外债主损失最大，', 'Overseas creditors take the biggest short-term hit,'],
  [122, '本国会被国际资本市场拉黑，', 'and the country is locked out of global markets,'],
  [125.5, '很难再借钱。', 'making it hard to borrow again.'],
  [128, '国内容易伴随股市大跌、', 'At home, stocks may crash,'],
  [131, '银行流动性紧张，', 'bank liquidity tightens,'],
  [133.5, '存款恐慌挤兑的风险上升。', 'and the risk of a deposit run rises.'],
  [137, '但大国走到这一步的概率极低，', 'But for large economies, this is very unlikely,'],
  [140, '代价太大。', 'because the cost is too high.'],
  // 144–164 普通人
  [144, '回到最开始的问题：', 'Back to the original question:'],
  [146.5, '国家欠债多，普通人一定会遭殃吗？', 'Does high national debt always hurt ordinary people?'],
  [150.5, '不一定，要看是内债还是外债、', 'Not necessarily. It depends on internal vs external debt,'],
  [153.5, '债务节奏能不能稳住。', 'and whether the pace can be stabilized.'],
  [156.5, '但风险来临时，最先受伤的，', 'When risk arrives, the first hurt are often'],
  [159.5, '往往是只拿着大量现金、', 'those holding only large amounts of cash'],
  [162, '单一资产的人。', 'and a single asset.'],
  // 164–176 总结
  [164, '债务本身不是洪水猛兽，', 'Debt itself is not a monster,'],
  [166, '失控的债务才是。', 'out-of-control debt is.'],
  [168, '大国债务的消化周期很长，', 'Large economies digest debt over a long cycle,'],
  [170, '很少瞬间崩塌，', 'rarely collapsing overnight,'],
  [172, '但它的影响，', 'but its impact'],
  [173.5, '会慢慢渗透到物价、利息', 'seeps into prices, interest,'],
  [175.2, '和你的收入里。', 'and your income.'],
  // 176–180 结尾
  [176.6, '下一期，我们聊聊，', 'Next time, we will ask:'],
  [178, '为什么有的国家敢一直借钱？', 'why can some countries keep borrowing?'],
];
export const CUES: [number, string, string][] = CUE_SECONDS.map(([s, cn, en]) => [fr(s), cn, en]);
export const cueStart = (i: number) => CUES[i][0];
export const cueEnd = (i: number) => (i + 1 < CUES.length ? CUES[i + 1][0] : DURATION);

/** 镜头：首尾相接；40/74/110/144/164/176 都落在 2 秒小节线上 */
export const SHOTS = {
  hook: [0, fr(12)], // 国家小人 + 欠条堆
  types: [fr(12), fr(40)], // 内债 vs 外债
  s1: [fr(40), fr(74)], // 温和稀释
  s2: [fr(74), fr(110)], // 外债爆雷
  s3: [fr(110), fr(144)], // 债务违约
  advice: [fr(144), fr(164)], // 三张建议卡
  summary: [fr(164), fr(176)], // 拉远总结
  outro: [fr(176), DURATION], // 下一期 + 点赞关注
} as const;

/** 音效：[文件, 帧, 音量] */
const A = 'audio/ep54-national-debt-story';
const s = (name: string, sec: number, v: number): [string, number, number] => [`${A}/${name}.wav`, fr(sec), v];
const shared = (name: string, sec: number, v: number): [string, number, number] => [`audio/sfx/${name}.wav`, fr(sec), v];
export const SFX: [string, number, number][] = [
  // 钩子
  s('impact', 0, 0.5),
  shared('paper', 2, 0.3),
  shared('paper', 5, 0.3),
  shared('paper', 8, 0.3),
  shared('paper', 11, 0.28),
  // 两种债
  shared('whoosh', 12, 0.25),
  shared('stamp', 12, 0.35),
  s('tick', 20, 0.2),
  s('impact', 30, 0.4),
  // 情景 1
  s('impact', 40, 0.4),
  s('tick', 47, 0.2),
  s('tick', 55, 0.2),
  s('tick', 62, 0.2),
  // 情景 2
  [`${A}/riser.wav`, fr(73), 0.55],
  s('impact', 74, 0.55),
  s('tick', 80, 0.22),
  shared('error', 88, 0.3),
  shared('error', 99, 0.3),
  s('impact', 105, 0.4),
  // 情景 3
  [`${A}/riser.wav`, fr(109), 0.6],
  s('impact', 110, 0.7),
  s('tick', 116, 0.25),
  s('impact', 128, 0.45),
  s('tick', 137, 0.2),
  // 普通人
  shared('whoosh', 144, 0.25),
  s('tick', 150, 0.2),
  s('tick', 156, 0.2),
  s('tick', 162, 0.2),
  // 总结 + 结尾
  s('impact', 164, 0.4),
  shared('whoosh', 176, 0.25),
  shared('ding', 178, 0.4),
];
