import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, keyframes, rand} from '../../library/anim';
import {BillG, WalletG} from '../../library/blackgold/bill';
import {BillStackG, CountryG} from '../../library/blackgold/country';
import {NeonLines} from '../../library/blackgold/charts';
import {ShockG} from '../../library/blackgold/pen';
import {GlowCard} from '../../library/blackgold/props';
import {CenterWord, ChapterTag, CiteLine} from '../../library/blackgold/stage';
import {B, BF, glowText} from '../../library/blackgold/theme';
import {DISCLAIMER, KEYWORD, SHOTS, fr} from './timeline';

/**
 * ep54 全国债务画面（180s）：
 * 钩子 → 两种债 → 温和稀释 → 外债爆雷 → 债务违约 → 普通人 → 总结 → 结尾。
 * 所有画面都是帧号的纯函数。
 */

/* ================= 0–12 钩子 ================= */
export const HookScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.hook;
  const burden = clamp01((f - fr(4)) / fr(6));
  return (
    <AbsoluteFill style={{opacity: clamp01((f + 1) / 8)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <CountryG f={f} at={s0} x={960} y={720} size={210} burden={burden} />
        <BillStackG f={f} at={fr(2)} x={960} y={780} count={10} />
        <ShockG f={f} at={fr(10)} x={960} y={720} r={190} color={B.red} seed={54} />
      </svg>
      <ChapterTag f={f} at={s0} cn="01 · 欠条堆" en="The debt pile" />
      <CiteLine f={f} at={fr(1)} line1="国家债务 · 示意" line2="欠条越堆越高" />
    </AbsoluteFill>
  );
};

/* ================= 12–40 两种债 ================= */
const DebtIcon: React.FC<{kind: 'internal' | 'external'}> = ({kind}) => {
  const c = kind === 'internal' ? B.gold : B.red;
  const symbol = kind === 'internal' ? '¥' : '$';
  return (
    <svg width={96} height={96} style={{position: 'absolute', right: 24, top: 24, overflow: 'visible'}}>
      <circle cx={48} cy={48} r={38} fill={`${c}12`} stroke={c} strokeWidth={2} style={{filter: `drop-shadow(0 0 10px ${c})`}} />
      <text x={48} y={60} textAnchor="middle" fontFamily={BF.latinBold} fontSize={38} fill={c} style={{filter: `drop-shadow(0 0 8px ${c})`}}>
        {symbol}
      </text>
    </svg>
  );
};

const Panel: React.FC<{kind: 'internal' | 'external'}> = ({kind}) => {
  const internal = kind === 'internal';
  const color = internal ? B.gold : B.red;
  return (
    <div style={{position: 'relative', padding: '34px 36px', height: '100%', boxSizing: 'border-box'}}>
      <DebtIcon kind={kind} />
      <div style={{fontFamily: BF.latin, fontSize: 15, letterSpacing: 5, color: B.inkFaint}}>{internal ? 'INTERNAL DEBT' : 'EXTERNAL DEBT'}</div>
      <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 58, marginTop: 6, ...glowText(color, 16, 0.9)}}>{internal ? '内债' : '外债'}</div>
      <div style={{fontFamily: BF.cn, fontSize: 25, lineHeight: 1.5, color: B.inkDim, marginTop: 12}}>
        {internal ? '欠自己国民的钱' : '欠外国和海外资本的钱'}
      </div>
      <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
        {(internal ? ['国债 / 地方债', '钱还在国内循环'] : ['要用外币偿还', '资本可能外流']).map((t) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: BF.cn, fontSize: 24, color: B.ink}}>
            <span style={{width: 8, height: 8, borderRadius: 4, background: color, boxShadow: `0 0 8px ${color}`}} />
            {t}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 26, height: 1, background: `linear-gradient(90deg, ${color}00, ${color}88, ${color}00)`}} />
    </div>
  );
};

export const TypesScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.types;
  const out = SHOTS.types[1] - 12;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={960} y1={320} x2={960} y2={900} stroke="rgba(229,201,145,0.25)" strokeWidth={1.5} strokeDasharray="4 12" />
        <path d="M520 760 C480 700 480 640 520 580" fill="none" stroke={B.gold} strokeWidth={2} strokeDasharray="5 8" opacity={0.6} />
        <path d="M548 580 C588 640 588 700 548 760" fill="none" stroke={B.gold} strokeWidth={2} strokeDasharray="5 8" opacity={0.6} />
        <path d="M1400 600 C1460 600 1500 640 1500 680" fill="none" stroke={B.red} strokeWidth={2} strokeDasharray="5 8" opacity={0.6} />
        <path d="M1400 720 C1460 720 1500 680 1500 640" fill="none" stroke={B.red} strokeWidth={2} strokeDasharray="5 8" opacity={0.6} />
      </svg>
      <GlowCard f={f} at={fr(12)} x={220} y={420} w={560} h={390} color={B.gold} out={out}>
        <Panel kind="internal" />
      </GlowCard>
      <GlowCard f={f} at={fr(14)} x={1140} y={420} w={560} h={390} color={B.red} out={out}>
        <Panel kind="external" />
      </GlowCard>
      <CenterWord f={f} at={fr(28)} text={KEYWORD} size={84} color={B.ink} y={330} out={out} />
      <ChapterTag f={f} at={s0} cn="02 · 两种债" en="Internal vs external" />
      <CiteLine f={f} at={s0 + 6} line1={DISCLAIMER} line2="本币 / 外币 · 钱去哪了" />
    </AbsoluteFill>
  );
};

/* ================= 40–74 温和稀释 ================= */
const DebtHill: React.FC<{f: number; at: number}> = ({f, at}) => {
  const grow = keyframes(f, [
    [at, 0],
    [at + fr(18), 1],
  ]);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="debt-hill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(237,210,135,0.34)" />
          <stop offset="100%" stopColor="rgba(237,210,135,0.02)" />
        </linearGradient>
      </defs>
      <path
        d={`M160 820 Q330 ${820 - 160 * grow} 620 ${820 - 330 * grow} T1200 820 Z`}
        fill="url(#debt-hill)"
        stroke={B.gold}
        strokeWidth={2.5}
        opacity={0.9}
        style={{filter: `drop-shadow(0 0 12px ${B.gold}66)`}}
      />
      <path d={`M160 820 Q330 ${820 - 160 * grow} 620 ${820 - 330 * grow} T1200 820`} fill="none" stroke={B.goldWarm} strokeWidth={2} opacity={0.6} />
      <text x={620} y={820 - 330 * grow + 44} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={30} fill={B.gold} style={glowText(B.gold, 10, 0.7)}>
        债务
      </text>
    </svg>
  );
};

export const Scenario1Scene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.s1;
  const out = s1 - 14;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <DebtHill f={f} at={s0 - 8} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M380 520 C470 580 540 640 620 700" fill="none" stroke={B.gold} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
        <path d="M1440 520 C1350 590 1260 650 1180 700" fill="none" stroke={B.cyan} strokeWidth={2} strokeDasharray="6 8" opacity={0.5} />
        <text x={380} y={500} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.gold} style={glowText(B.gold, 8, 0.6)}>
          央行
        </text>
        <text x={1440} y={500} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={28} fill={B.cyan} style={glowText(B.cyan, 8, 0.6)}>
          税收
        </text>
        <text x={300} y={540} textAnchor="middle" fontFamily={BF.latin} fontSize={14} letterSpacing={3} fill={B.inkFaint}>CENTRAL BANK</text>
        <text x={1520} y={540} textAnchor="middle" fontFamily={BF.latin} fontSize={14} letterSpacing={3} fill={B.inkFaint}>TAX REVENUE</text>
      </svg>
      <GlowCard f={f} at={fr(44)} x={240} y={300} w={300} h={160} color={B.gold} out={out}>
        <div style={{padding: 22, fontFamily: BF.cn, fontSize: 24, lineHeight: 1.6, color: B.inkDim}}>印钞 / 利率<br />慢慢稀释</div>
      </GlowCard>
      <GlowCard f={f} at={fr(48)} x={1380} y={300} w={300} h={160} color={B.cyan} out={out}>
        <div style={{padding: 22, fontFamily: BF.cn, fontSize: 24, lineHeight: 1.6, color: B.inkDim}}>税收 / 增长<br />慢慢还</div>
      </GlowCard>
      <CenterWord f={f} at={fr(60)} text="购买力缩水" size={82} color={B.goldWarm} y={260} out={out} />
      <ChapterTag f={f} at={s0} cn="03 · 温和稀释" en="Slow dilution" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="长期通胀 / 税收 / 增长 · 示意" line2="没有爆炸，但代价藏在细节里" out={out} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', opacity: clamp01((f - fr(64)) / 14) * 0.8, fontFamily: BF.cn, fontSize: 26, color: B.goldWarm}}>
        隐性代价：物价涨，利息追不上通胀
      </div>
    </AbsoluteFill>
  );
};

/* ================= 74–110 外债爆雷 ================= */
export const Scenario2Scene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.s2;
  const out = s1 - 14;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 50% at 72% 45%, rgba(130,34,28,0.22) 0%, rgba(0,0,0,0) 70%)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <BillG f={f} at={fr(74) - 8} x={360} y={540} w={360} h={240} title="外债" subtitle="EXTERNAL DEBT" amount="缺美元" lines={['外币偿还', '外储告急', '资本外流']} stamp="RISK" color={B.red} out={out} tilt={-4} />
        {/* 美元外流 */}
        {Array.from({length: 7}, (_, i) => {
          const p = clamp01((f - fr(78 + i * 2)) / fr(16));
          return (
            <text
              key={i}
              x={1360 + p * 240 + Math.sin(f / 20 + i) * 10}
              y={360 + i * 34 - p * 60}
              fontFamily={BF.latinBold}
              fontSize={34}
              fill={B.red}
              opacity={p * (1 - p * 0.5)}
              style={{filter: `drop-shadow(0 0 8px ${B.red})`}}
            >
              $
            </text>
          );
        })}
        <path d="M1220 470 C1320 470 1400 440 1500 400" fill="none" stroke={B.red} strokeWidth={2.5} strokeDasharray="7 8" markerEnd="url(#fx-out)" opacity={0.75} />
        <defs>
          <marker id="fx-out" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill={B.red} />
          </marker>
        </defs>
        <text x={1300} y={330} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={B.red} style={glowText(B.red, 8, 0.7)}>
          资本外流
        </text>
      </svg>
      <NeonLines
        f={f}
        at={fr(82)}
        x={700}
        y={820}
        w={760}
        h={360}
        lines={[{pts: [[0, 0.86], [0.18, 0.8], [0.35, 0.64], [0.52, 0.4], [0.7, 0.2], [1, 0.08]], color: B.red, at: fr(82), label: '汇率 / 外储'}]
        }
        dashY={0.3}
        dashLabel="警戒线"
        cross={{p: [0.65, 0.26], at: fr(94)}}
        out={out}
      />
      <GlowCard f={f} at={fr(88)} x={1390} y={590} w={330} h={220} color={B.red} out={out}>
        <div style={{padding: 24}}>
          <div style={{fontFamily: BF.latin, fontSize: 14, letterSpacing: 5, color: B.inkFaint}}>BANK WARNING</div>
          <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 32, marginTop: 8, ...glowText(B.red, 12, 0.8)}}>银行告警</div>
          <div style={{fontFamily: BF.cn, fontSize: 21, color: B.inkDim, marginTop: 10}}>流动性紧张<br />坏账上升</div>
        </div>
      </GlowCard>
      <CenterWord f={f} at={fr(90)} text="外债危机" size={86} color={B.red} y={270} out={out} />
      <ChapterTag f={f} at={s0} cn="04 · 外债危机" en="External debt crisis" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="汇率 / 外储 / 进口价格 · 示意" line2="外币不够，危机会传导得很快" out={out} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', opacity: clamp01((f - fr(94)) / 14) * 0.8, fontFamily: BF.cn, fontSize: 26, color: B.red}}>
        进口变贵 → 输入性通胀 → 裁员降薪
      </div>
    </AbsoluteFill>
  );
};

/* ================= 110–144 债务违约 ================= */
export const Scenario3Scene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.s3;
  const out = s1 - 14;
  const shake = f >= fr(110) && f < fr(120) ? 8 : 0;
  const sx = Math.sin(f * 1.7) * shake;
  const sy = Math.cos(f * 2.1) * shake;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 52% at 50% 45%, rgba(130,34,28,0.3) 0%, rgba(0,0,0,0) 72%)'}} />
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <BillG f={f} at={fr(110) - 8} x={960} y={540} w={620} h={380} title="违约" subtitle="SOVEREIGN DEFAULT" amount="DEFAULT" lines={['债券到期', '还不上', '失去融资']} stamp="X" color={B.red} out={out} tilt={-3} />
          <g opacity={clamp01((f - (fr(112) - 4)) / 8)} style={{filter: `drop-shadow(0 0 18px ${B.red})`}}>
            <line x1={740} y1={400} x2={1180} y2={680} stroke={B.red} strokeWidth={16} strokeLinecap="round" />
            <line x1={1180} y1={400} x2={740} y2={680} stroke={B.red} strokeWidth={16} strokeLinecap="round" />
          </g>
          {Array.from({length: 26}, (_, i) => {
            const x = 220 + rand(i + 3) * 1480;
            const y = ((f * 2 + i * 53) % 900) + 60;
            return <circle key={i} cx={x} cy={y} r={2 + rand(i + 9) * 4} fill={i % 3 === 0 ? B.red : B.inkFaint} opacity={0.35} />;
          })}
          <ShockG f={f} at={fr(110)} x={960} y={540} r={280} color={B.red} seed={55} />
        </svg>
        <CenterWord f={f} at={fr(132)} text="失去海外融资能力" size={62} color={B.red} y={250} out={out} />
        <GlowCard f={f} at={fr(128)} x={1370} y={690} w={360} h={210} color={B.red} out={out}>
          <div style={{padding: 22}}>
            <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 30, ...glowText(B.red, 10, 0.8)}}>国内风险</div>
            <div style={{fontFamily: BF.cn, fontSize: 21, color: B.inkDim, marginTop: 8, lineHeight: 1.6}}>股市大跌<br />银行流动性紧张<br />存款挤兑风险</div>
          </div>
        </GlowCard>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="05 · 债务违约" en="Sovereign default" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="违约 / 重组 / 资本管制 · 示意" line2="大国走到这一步的概率极低" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 144–164 普通人 ================= */
const AdviceCard: React.FC<{title: string; lines: string[]; color: string}> = ({title, lines, color}) => (
  <div style={{padding: '34px 30px', height: '100%', boxSizing: 'border-box'}}>
    <div style={{width: 54, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 14px ${color}`}} />
    <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 40, marginTop: 24, ...glowText(color, 12, 0.8)}}>{title}</div>
    <div style={{fontFamily: BF.cn, fontSize: 24, lineHeight: 1.7, color: B.inkDim, marginTop: 18}}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  </div>
);

export const AdviceScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.advice;
  const out = s1 - 12;
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <GlowCard f={f} at={fr(146)} x={250} y={420} w={380} h={300} color={B.gold} out={out}>
        <AdviceCard title="存款分散" lines={['别把全部现金', '放在一个篮子里']} color={B.gold} />
      </GlowCard>
      <GlowCard f={f} at={fr(150)} x={770} y={420} w={380} h={300} color={B.cyan} out={out}>
        <AdviceCard title="避开单一资产" lines={['现金、房产、股票', '别只押一种']} color={B.cyan} />
      </GlowCard>
      <GlowCard f={f} at={fr(154)} x={1290} y={420} w={380} h={300} color={B.red} out={out}>
        <AdviceCard title="不要盲目加杠杆" lines={['贷款会放大', '你的风险']} color={B.red} />
      </GlowCard>
      <WalletG f={f} at={fr(148)} x={960} y={790} size={180} hot={0.55} label="现金" out={out} />
      <CenterWord f={f} at={fr(158)} text="现金 ≠ 安全" size={78} color={B.ink} y={270} out={out} />
      <ChapterTag f={f} at={s0} cn="06 · 普通人" en="What can you do?" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="存款分散 / 资产配置 / 杠杆 · 非投资建议" line2="风险来临时，现金也可能变薄" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 164–176 总结 ================= */
export const SummaryScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.summary;
  const out = s1 - 10;
  const pull = keyframes(f, [
    [s0, 0],
    [s1, 1],
  ]);
  return (
    <AbsoluteFill style={{opacity: 0.3 + 0.7 * clamp01((f - s0) / 12)}}>
      <AbsoluteFill style={{transform: `scale(${1.08 - 0.08 * pull})`, transformOrigin: '50% 58%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <g opacity={0.5}>
            <CountryG f={f} at={s0 - 40} x={960} y={720} size={190} burden={1} />
          </g>
          <BillStackG f={f} at={fr(164) - 8} x={960} y={780} count={8} out={out} />
        </svg>
        <CenterWord f={f} at={fr(168)} text="失控的债务" size={104} color={B.ink} y={310} out={out} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', opacity: clamp01((f - fr(170)) / 14) * 0.85, fontFamily: BF.cn, fontSize: 30, color: B.goldWarm}}>
          会慢慢渗透到物价、利息和你的收入
        </div>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="07 · 总结" en="The long bill" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="债务 / 物价 / 利息 / 收入" line2="失控的债务才是" out={out} />
    </AbsoluteFill>
  );
};

/* ================= 176–180 结尾 ================= */
export const OutroScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.outro;
  const a = clamp01((f - s0) / 10);
  return (
    <AbsoluteFill style={{opacity: a}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}} opacity={0.45}>
        <BillStackG f={f} at={s0 - 20} x={960} y={780} count={4} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
        <div style={{fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.45em', color: B.goldWarm}}>NEXT EPISODE</div>
        <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 76, marginTop: 14, ...glowText(B.ink, 14, 0.6)}}>下一期，我们聊聊：</div>
        <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 66, marginTop: 18, ...glowText(B.gold, 20, 0.9)}}>为什么有的国家敢一直借钱？</div>
        <div style={{display: 'inline-block', marginTop: 38, padding: '14px 34px', border: `2px solid ${B.red}`, borderRadius: 12, background: 'rgba(40,10,6,0.8)', fontFamily: BF.cn, fontWeight: 900, fontSize: 34, ...glowText(B.ink, 8, 0.4)}}>
          点赞关注 · 看懂财经底层逻辑
        </div>
      </div>
      <ChapterTag f={f} at={s0} cn="08 · 下一期" en="Next episode" />
    </AbsoluteFill>
  );
};
