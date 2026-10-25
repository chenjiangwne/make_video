import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {BillG, WalletG} from '../../library/blackgold/bill';
import {GlowBars, NeonLines} from '../../library/blackgold/charts';
import {ChapterTag, CiteLine} from '../../library/blackgold/stage';
import {B, BF, blurIn, glowText} from '../../library/blackgold/theme';
import {BUDGET, CASES, QUOTE_1, SHOTS, fbt} from './timeline';

/**
 * ep53 的画面：一张欠条贯穿全片。
 * 钩子（欠条 + 钱包）→ 标题 → 三张账单 → 政府利息 → 银行—主权循环
 * → 家庭通胀 / 利率 / 就业 → 本币 vs 外币 → 欠条压近 → 「账单」→ 大字卡 → 结尾。
 */

/* ================= 钩子 ================= */
export const HookScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.hook;
  const push = keyframes(f, [
    [fbt(24), 0],
    [SHOTS.title[0], 1],
  ]);
  return (
    <AbsoluteFill style={{opacity: clamp01((f + 1) / 8)}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.06 * push})`, transformOrigin: '50% 55%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={960} cy={540} r={360} fill="none" stroke="rgba(229,201,145,0.16)" strokeWidth={1.5} strokeDasharray="4 12" />
          <BillG f={f} at={s0} x={960} y={520} w={720} h={420} title="DEBT" subtitle="SOVEREIGN DEBT · 国债" amount="???" lines={['本金', '利息', '到期滚续']} stamp="DUE" tilt={-3} />
          <WalletG f={f} at={fbt(8)} x={470} y={810} size={240} hot={0.7} label="你的存款" />
          <g opacity={clamp01((f - fbt(8)) / 14)}>
            <path d="M640 742 C610 766 580 782 548 792" fill="none" stroke={B.red} strokeWidth={2} strokeDasharray="5 9" markerEnd="url(#bill-arrow)" />
            <defs>
              <marker id="bill-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill={B.red} />
              </marker>
            </defs>
          </g>
          <g opacity={blurIn(f, fbt(16), 14).opacity}>
            <text x={1420} y={410} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.goldWarm} style={glowText(B.goldWarm, 10, 0.6)}>
              政府
            </text>
            <text x={1420} y={540} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.red} style={glowText(B.red, 10, 0.6)}>
              银行
            </text>
            <text x={1420} y={670} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.cyan} style={glowText(B.cyan, 10, 0.6)}>
              家庭
            </text>
            <line x1={1420} y1={430} x2={1420} y2={500} stroke={B.goldLine} strokeWidth={1.5} strokeDasharray="4 6" />
            <line x1={1420} y1={560} x2={1420} y2={630} stroke={B.goldLine} strokeWidth={1.5} strokeDasharray="4 6" />
          </g>
        </svg>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="深夜账本" en="The bill" />
      <CiteLine f={f} at={fbt(16)} line1="Sovereign debt · 示意" line2="国家信用 · 货币 · 银行" />
    </AbsoluteFill>
  );
};

/* ================= 标题 ================= */
export const TitleScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.title;
  return (
    <AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="黑金光影 · 宏观账本" en="Macro ledger" />
    </AbsoluteFill>
  );
};

/* ================= 三张账单 ================= */
export const IntroScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.intro;
  const out = s1 - 14;
  const hl = keyframes(f, [
    [fbt(56), 0],
    [fbt(64), 1],
  ]);
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={260} y1={820} x2={1660} y2={820} stroke="rgba(229,201,145,0.25)" strokeWidth={1.5} strokeDasharray="4 10" />
        <BillG f={f} at={fbt(40)} x={420} y={520} w={380} h={260} title="政府的账单" subtitle="BILL 01 · GOVERNMENT" amount="利息 ↑" lines={['预算', '公共服务', '借新还旧']} stamp="01" color={B.gold} out={out} tilt={-2} />
        <BillG f={f} at={fbt(48)} x={960} y={520} w={380} h={260} title="银行的账单" subtitle="BILL 02 · BANKS" amount="国债 ↓" lines={['资本', '抵押', '挤兑']} stamp="02" color={B.red} out={out} tilt={1} />
        <g transform={`translate(1500 520) scale(${1 + 0.08 * hl}) translate(-1500 -520)`}>
          <BillG f={f} at={fbt(56)} x={1500} y={520} w={380} h={260} title="你家的账单" subtitle="BILL 03 · HOUSEHOLD" amount="购买力 ↓" lines={['通胀', '利率', '就业']} stamp="03" color={B.cyan} out={out} tilt={-1} />
        </g>
        <g opacity={clamp01((f - fbt(56)) / 14)}>
          <path d="M650 700 L650 740 L1270 740 L1270 700" fill="none" stroke={B.gold} strokeWidth={2} strokeDasharray="6 8" />
          <path d="M1270 700 L1300 730 L1240 730 Z" fill={B.gold} opacity={0.8} />
          <text x={960} y={796} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.goldWarm} style={glowText(B.goldWarm, 10, 0.6)}>
            账单往下传
          </text>
        </g>
      </svg>
      <ChapterTag f={f} at={s0} cn="三张账单" en="Three bills" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="GOVERNMENT · BANKS · HOUSEHOLD" line2="政府 → 银行 → 家庭" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 政府的账单 ================= */
export const GovScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.gov;
  const out = s1 - 14;
  const grow = keyframes(f, [
    [fbt(80), 0],
    [fbt(104), 1],
  ]);
  const interest = 24 + 18 * grow;
  const edu = 26 - 8 * grow;
  const health = 22 - 6 * grow;
  const other = 100 - interest - edu - health;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <BillG f={f} at={fbt(80) - 8} x={390} y={560} w={400} h={270} title="政府的账单" subtitle="GOVERNMENT BUDGET" amount="利息 ↑" lines={['借新还旧', '到期滚续', '刚性支出']} stamp="DUE" color={B.gold} out={out} tilt={-3} />
        {/* 借新还旧环 */}
        <g transform="translate(1500 760)" opacity={clamp01((f - fbt(96)) / 14)}>
          <path d="M-90 0 A 90 90 0 0 1 0 -90" fill="none" stroke={B.gold} strokeWidth={2.5} markerEnd="url(#loop-arrow)" />
          <path d="M90 0 A 90 90 0 0 1 0 90" fill="none" stroke={B.red} strokeWidth={2.5} markerEnd="url(#loop-arrow-red)" />
          <defs>
            <marker id="loop-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 Z" fill={B.gold} />
            </marker>
            <marker id="loop-arrow-red" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 Z" fill={B.red} />
            </marker>
          </defs>
          <text x={-150} y={-40} fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.gold} style={glowText(B.gold, 8, 0.6)}>
            借新
          </text>
          <text x={70} y={120} fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.red} style={glowText(B.red, 8, 0.6)}>
            还旧
          </text>
          <text x={0} y={12} textAnchor="middle" fontFamily={BF.latin} fontSize={16} letterSpacing={4} fill={B.inkFaint}>
            ROLLOVER
          </text>
        </g>
        <text x={760} y={300} fontFamily={BF.cn} fontWeight={900} fontSize={32} fill={B.ink} style={glowText(B.ink, 10, 0.5)}>
          利息，先挤预算
        </text>
      </svg>
      <GlowBars f={f} at={fbt(80) - 8} x={640} y={860} w={1000} h={430} values={[Math.round(interest), Math.round(edu), Math.round(health), Math.round(other)]} labels={['利息', '教育', '医疗', '其他']} max={100} hi={0} stagger={5} out={out} />
      <ChapterTag f={f} at={s0} cn="01 · 政府的账单" en="Interest eats the budget" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="预算结构 · 示意" line2={BUDGET.note} out={out} />
      <div style={{position: 'absolute', left: 1390, width: 380, top: 300, textAlign: 'center', opacity: clamp01((f - fbt(96)) / 14)}}>
        <div style={{fontFamily: BF.latinBold, fontSize: 54, ...glowText(B.red, 18)}}>({Math.round(interest)}%)</div>
        <div style={{fontFamily: BF.cn, fontSize: 22, color: B.inkDim}}>利息占比 · 示意</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 银行的账单 ================= */
const BankSheet: React.FC<{f: number; at: number; out: number}> = ({f, at, out}) => {
  const a = blurIn(f, at, 14, out);
  if (a.v <= 0) return null;
  const hole = clamp01((f - fbt(144)) / 12);
  const run = clamp01((f - fbt(160)) / 14);
  return (
    <g transform={`translate(620 290) scale(${0.94 + 0.06 * a.v})`} opacity={a.opacity} style={{filter: a.filter}}>
      <rect x={0} y={0} width={600} height={450} rx={8} fill="rgba(12,8,6,0.82)" stroke={B.goldLine} strokeWidth={1.6} />
      <text x={24} y={36} fontFamily={BF.latin} fontSize={16} letterSpacing={6} fill="rgba(229,201,145,0.6)">
        BANK BALANCE SHEET · 银行
      </text>
      <line x1={300} y1={64} x2={300} y2={420} stroke="rgba(229,201,145,0.25)" strokeWidth={1} />
      <text x={40} y={98} fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.goldWarm}>资产</text>
      <text x={330} y={98} fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.cyan}>负债</text>
      {[
        ['国债', B.red],
        ['贷款', B.gold],
        ['现金', B.goldWarm],
      ].map(([t, c], i) => (
        <g key={t as string}>
          <rect x={40} y={124 + i * 64} width={220} height={46} rx={4} fill="rgba(255,255,255,0.04)" stroke="rgba(229,201,145,0.22)" />
          <text x={56} y={154 + i * 64} fontFamily={BF.cn} fontSize={24} fill={c as string}>{t as string}</text>
          <line x1={176} y1={140 + i * 64} x2={252} y2={140 + i * 64} stroke={c as string} strokeWidth={2} opacity={0.6} />
        </g>
      ))}
      {[
        ['存款', B.cyan],
        ['同业', B.inkDim],
        ['资本', B.inkDim],
      ].map(([t, c], i) => (
        <g key={t as string}>
          <rect x={330} y={124 + i * 64} width={220} height={46} rx={4} fill="rgba(255,255,255,0.04)" stroke="rgba(229,201,145,0.22)" />
          <text x={346} y={154 + i * 64} fontFamily={BF.cn} fontSize={24} fill={c as string}>{t as string}</text>
        </g>
      ))}
      <g opacity={hole}>
        <rect x={330} y={340} width={220} height={46} rx={4} fill="rgba(255,90,60,0.18)" stroke={B.red} strokeWidth={2} style={{filter: `drop-shadow(0 0 10px ${B.red})`}} />
        <text x={346} y={370} fontFamily={BF.cn} fontWeight={900} fontSize={24} fill={B.red}>资本窟窿</text>
      </g>
      <g opacity={run}>
        {[0, 1, 2, 3].map((i) => {
          const x = 300 + i * 16;
          const y = 520 + i * 8;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle cx={0} cy={-22} r={7} fill={B.inkDim} />
              <line x1={0} y1={-14} x2={0} y2={8} stroke={B.inkDim} strokeWidth={3} strokeLinecap="round" />
              <line x1={0} y1={0} x2={-12} y2={16} stroke={B.inkDim} strokeWidth={3} strokeLinecap="round" />
              <line x1={0} y1={0} x2={12} y2={16} stroke={B.inkDim} strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })}
        <text x={260} y={585} fontFamily={BF.cn} fontWeight={900} fontSize={24} fill={B.red}>挤兑</text>
      </g>
    </g>
  );
};

export const BankScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.bank;
  const out = s1 - 14;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <BillG f={f} at={fbt(120) - 8} x={330} y={520} w={360} h={250} title="国债" subtitle="GOVERNMENT BOND" amount="价格 ↓" lines={['银行持有', '抵押品', '资本金']} stamp="HOLD" color={B.red} out={out} tilt={-4} />
        <BankSheet f={f} at={fbt(120) - 8} out={out} />
        {/* 政府 ↔ 银行 循环 */}
        <g transform="translate(1450 350)" opacity={clamp01((f - fbt(168)) / 14)}>
          <circle cx={0} cy={0} r={118} fill="none" stroke="rgba(229,201,145,0.22)" strokeWidth={1.5} strokeDasharray="5 9" />
          <text x={0} y={-132} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.gold} style={glowText(B.gold, 8, 0.6)}>政府</text>
          <text x={0} y={148} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.red} style={glowText(B.red, 8, 0.6)}>银行</text>
          <path d="M-84 -50 A 98 98 0 0 1 84 -50" fill="none" stroke={B.gold} strokeWidth={2} markerEnd="url(#gov-bank)" />
          <path d="M84 50 A 98 98 0 0 1 -84 50" fill="none" stroke={B.red} strokeWidth={2} markerEnd="url(#bank-gov)" />
          <defs>
            <marker id="gov-bank" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill={B.gold} /></marker>
            <marker id="bank-gov" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill={B.red} /></marker>
          </defs>
          <text x={0} y={2} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={22} fill={B.ink} style={glowText(B.ink, 6, 0.4)}>主权—银行</text>
        </g>
      </svg>
      <NeonLines
        f={f}
        at={fbt(144)}
        x={1320}
        y={780}
        w={470}
        h={330}
        lines={[{pts: [[0, 0.82], [0.25, 0.76], [0.5, 0.58], [0.75, 0.34], [1, 0.18]], color: B.red, at: fbt(144), label: '国债价格'}]
        }
        dashY={0.3}
        dashLabel="资本线"
        cross={{p: [0.72, 0.36], at: fbt(160)}}
        out={out}
      />
      <ChapterTag f={f} at={s0} cn="02 · 银行的账单" en="The sovereign-bank loop" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="Sovereign-bank nexus · 示意" line2="国债跌价 → 资本受损 → 挤兑" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 家庭的账单 ================= */
export const HouseholdScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.household;
  const out = s1 - 14;
  const hot = keyframes(f, [
    [fbt(176), 0.2],
    [fbt(208), 0.9],
  ]);
  const shrink = keyframes(f, [
    [fbt(176), 1],
    [fbt(208), 0.74],
  ]);
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <BillG f={f} at={fbt(176) - 8} x={400} y={430} w={350} h={250} title="通胀" subtitle="INFLATION" amount="物价 ↑" lines={['同样一百块', '买到更少']} stamp="PAY" color={B.red} out={out} tilt={-3} />
        <BillG f={f} at={fbt(176) - 4} x={960} y={430} w={350} h={250} title="利率" subtitle="INTEREST RATES" amount="月供 ↑" lines={['房贷', '消费贷']} stamp="PAY" color={B.gold} out={out} tilt={0} />
        <BillG f={f} at={fbt(176) - 1} x={1520} y={430} w={350} h={250} title="就业" subtitle="JOBS" amount="岗位 ↓" lines={['裁员', '收入']} stamp="PAY" color={B.red} out={out} tilt={2} />
        <WalletG f={f} at={fbt(176) - 8} x={500} y={700} size={210} hot={hot} out={out} />
        <g transform={`translate(960 760)`} opacity={clamp01((f - fbt(200)) / 14)}>
          <text x={-190} y={-20} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.ink} style={glowText(B.ink, 8, 0.4)}>100 元</text>
          <line x1={-120} y1={-30} x2={-30} y2={-30} stroke={B.gold} strokeWidth={2} markerEnd="url(#pay-arrow)" />
          <defs><marker id="pay-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill={B.gold} /></marker></defs>
          <rect x={-10} y={-54} width={300 * shrink} height={48} rx={8} fill="rgba(255,90,60,0.18)" stroke={B.red} strokeWidth={2} />
          <text x={140} y={-20} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.red}>购买力</text>
        </g>
      </svg>
      <ChapterTag f={f} at={s0} cn="03 · 你家的账单" en="Your household" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="通胀 / 利率 / 就业 · 示意" line2="名义存款 ≠ 实际购买力" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 本币 vs 外币 ================= */
export const CurrencyScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.currency;
  const out = s1 - 14;
  const leftOn = clamp01((f - fbt(224)) / 14);
  const rightOn = clamp01((f - fbt(224)) / 14);
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={960} y1={250} x2={960} y2={900} stroke="rgba(229,201,145,0.25)" strokeWidth={1.5} strokeDasharray="4 12" />
        <text x={480} y={250} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={34} fill={B.gold} opacity={leftOn} style={glowText(B.gold, 12, 0.7)}>本币债</text>
        <text x={480} y={292} textAnchor="middle" fontFamily={BF.latin} fontSize={16} letterSpacing={4} fill={B.inkFaint} opacity={leftOn}>OWN CURRENCY</text>
        <text x={1440} y={250} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={34} fill={B.red} opacity={rightOn} style={glowText(B.red, 12, 0.7)}>外币债</text>
        <text x={1440} y={292} textAnchor="middle" fontFamily={BF.latin} fontSize={16} letterSpacing={4} fill={B.inkFaint} opacity={rightOn}>FOREIGN CURRENCY</text>
        <BillG f={f} at={fbt(224) - 8} x={480} y={560} w={430} h={280} title="本币债" subtitle="LOCAL CURRENCY DEBT" amount="通胀 / 贬值" lines={['印钞', '稀释', '名义不违约']} stamp="¥" color={B.gold} out={out} tilt={-3} />
        <BillG f={f} at={fbt(224) - 8} x={1440} y={560} w={430} h={280} title="外币债" subtitle="FOREIGN CURRENCY DEBT" amount="缺美元" lines={['违约', '重组', '进口崩溃']} stamp="$" color={B.red} out={out} tilt={3} />
        <text x={480} y={800} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.gold} opacity={leftOn}>自己的货币：用通胀稀释</text>
        <text x={1440} y={800} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.red} opacity={rightOn}>别人的货币：真的会还不上</text>
        <g opacity={clamp01((f - fbt(264)) / 14)}>
          {CASES.map((c, i) => (
            <g key={c.country} transform={`translate(${330 + i * 440} 930)`}>
              <text textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={24} fill={B.ink}>{c.country}</text>
              <text y={26} textAnchor="middle" fontFamily={BF.latin} fontSize={18} fill={B.red}>{c.year} · {c.event}</text>
            </g>
          ))}
        </g>
      </svg>
      <ChapterTag f={f} at={s0} cn="04 · 两种债" en="Own currency vs foreign currency" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="本币 vs 外币 · 关键区别" line2="2001 阿根廷 · 2019 黎巴嫩 · 2022 斯里兰卡" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 收束：欠条压近 ================= */
export const BuildScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.build;
  const push = keyframes(f, [
    [s0, 0],
    [s1, 1],
  ]);
  return (
    <AbsoluteFill style={{opacity: 0.35 + 0.65 * clamp01((f - s0) / 18)}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.22 * push}) rotate(${-2 + 3 * push}deg)`, transformOrigin: '50% 52%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <BillG f={f} at={s0 - 100} x={960} y={540} w={760} h={450} title="DEBT" subtitle="SOVEREIGN DEBT · 国债" amount="DUE" lines={['利息', '到期', '谁来付？']} stamp="DUE" tilt={-3} />
          <WalletG f={f} at={s0 - 60} x={420} y={850} size={190} hot={0.9} dim={0.35} />
        </svg>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="最后一张" en="The bill comes due" />
    </AbsoluteFill>
  );
};

/* ================= 爆点之后：重新定价 ================= */
export const AftermathScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.aftermath;
  const out = s1 - 10;
  return (
    <AbsoluteFill style={{opacity: 0.35 + 0.65 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <BillG f={f} at={s0 - 70} x={960} y={520} w={640} h={380} title="DEBT" subtitle="SOVEREIGN DEBT · 国债" amount="REPRICED" lines={['货币', '存款', '工资']} stamp="重定价" color={B.red} out={out} tilt={-3} />
        <WalletG f={f} at={s0 - 50} x={1440} y={780} size={200} hot={0.8} dim={0.25} out={out} />
        <text x={960} y={300} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.red} opacity={clamp01((f - s0) / 14)} style={glowText(B.red, 12, 0.8)}>
          货币先，存款后
        </text>
      </svg>
      <ChapterTag f={f} at={s0} cn="账单到期" en="The bill comes due" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="货币 → 存款 → 工资" line2="本币贬值 / 外币违约 · 示意" out={out} />
    </AbsoluteFill>
  );
};
/* ================= 大字卡 ================= */
export const QuoteScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.quote;
  const out = s1 - 8;
  const reveal = clamp01((f - s0) / 16);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}} opacity={0.5}>
        <WalletG f={f} at={s0 - 180} x={1460} y={790} size={210} hot={0.5} dim={0.3} out={out} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 46%, rgba(120,80,40,0.2) 0%, rgba(0,0,0,0) 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: reveal * 0.8, fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.45em', color: B.goldWarm}}>
        THE BILL · 账单
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 310, textAlign: 'center', opacity: reveal, filter: `blur(${(1 - reveal) * 8}px)`}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 82, letterSpacing: 4, ...glowText(B.ink, 12, 0.6)}}>{QUOTE_1}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', opacity: reveal, transform: `scale(${1.02 - 0.02 * reveal})`}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 112, letterSpacing: 6, ...glowText('#ffb08c', 28, 1)}}>只是被</span>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 112, letterSpacing: 6, ...glowText(B.red, 26, 1)}}>重新定价</span>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 112, letterSpacing: 6, ...glowText('#ffb08c', 28, 1)}}>了。</span>
      </div>
      <div style={{position: 'absolute', left: 960 - 520, width: 1040, top: 630, height: 1, background: 'linear-gradient(90deg, rgba(229,201,145,0) 0%, rgba(229,201,145,0.55) 50%, rgba(229,201,145,0) 100%)', opacity: reveal}} />
      <div style={{position: 'absolute', left: 960 - 560, width: 1120, top: 660, textAlign: 'center', opacity: reveal * 0.75, fontFamily: BF.latin, fontStyle: 'italic', fontSize: 26, lineHeight: 1.5, color: B.inkDim}}>
        Your savings didn’t vanish. They were repriced.
      </div>
    </AbsoluteFill>
  );
};

/* ================= 结尾 ================= */
export const EndScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.end;
  const dimQ = clamp01((f - fbt(356)) / 20);
  return (
    <AbsoluteFill style={{opacity: (0.45 + 0.55 * clamp01((f - s0) / 20)) * (1 - 0.25 * dimQ)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={560} r={360} fill="none" stroke="rgba(229,201,145,0.25)" strokeWidth={1.5} strokeDasharray="4 12" />
        <BillG f={f} at={s0} x={960} y={540} w={640} h={380} title="DEBT" subtitle="SOVEREIGN DEBT · 国债" amount="DUE" lines={['利息', '存款', '购买力']} stamp="DUE" tilt={-3} dim={0.2} />
        <WalletG f={f} at={fbt(352)} x={1500} y={720} size={180} hot={0.35} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 46% 40% at 50% 54%, rgba(170,120,50,0.2) 0%, rgba(0,0,0,0) 72%)'}} />
    </AbsoluteFill>
  );
};
