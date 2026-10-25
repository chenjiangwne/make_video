import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {GlowCard} from '../../library/blackgold/props';
import {ChapterTag, CiteLine} from '../../library/blackgold/stage';
import {MilkGlassG, WaveTarget} from '../../library/blackgold/target';
import {B, BF, blurIn, drawP, glowText} from '../../library/blackgold/theme';
import {
  DEMO_TEMP,
  HOT_ANGLES,
  MICROWAVE,
  PLATE_R,
  QUOTE_1,
  QUOTE_EN,
  SHOTS,
  fbt,
} from './timeline';

/**
 * ep52 的画面：一整张靶心贯穿全片——
 * 钩子（同一杯牛奶左烫右温）→ 标题 → 炉腔里的驻波 → 取下转盘放正中 → 转盘带着杯子绕圈
 * → 不转 / 转的对比 → 推近靶心 → 「靶心」砸出 → 大字卡 → 告别。
 * 所有动画都是帧号的纯函数，坐标用 1920×1080 舞台坐标。
 */

/** 杯子在某个角度离最近的热点有多近：0 凉，1 正压在热点上 */const hotAt = (deg: number) => {
  let best = 0;
  for (const h of HOT_ANGLES) {
    const d = Math.abs(((deg - h + 180) % 360) - 180);
    best = Math.max(best, Math.exp(-Math.pow(d / 22, 2)));
  }
  return best;
};

const spinAt = (f: number, at: number, degPerSec: number, start = -90) => start + ((f - at) / 30) * degPerSec;

/* ================= 钩子 ================= */
export const HookScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.hook;
  const move = keyframes(f, [
    [fbt(5), 770],
    [fbt(8), 1150],
  ]);
  const hot = 1 - clamp01((f - fbt(5)) / (fbt(8) - fbt(5)));
  const reveal = clamp01((f - fbt(8)) / 20);
  const push = keyframes(f, [
    [fbt(24), 0],
    [SHOTS.title[0], 1],
  ]);
  const ghost = blurIn(f, fbt(12), 16, fbt(28), 14).opacity;
  return (
    <AbsoluteFill style={{opacity: clamp01((f + 1) / 8)}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.09 * push})`, transformOrigin: '50% 57%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={960} cy={610} r={PLATE_R + 22} fill="rgba(10,7,5,0.6)" stroke="rgba(229,201,145,0.22)" strokeWidth={1.5} />
          <circle cx={960} cy={610} r={PLATE_R - 6} fill="none" stroke="rgba(255,250,240,0.14)" strokeWidth={1} />
          <g transform="translate(960 610)">
            <WaveTarget f={f} at={s0} r={325} hot={0.28 + 0.72 * reveal} labels={reveal > 0.02} spin={0} />
          </g>
          <MilkGlassG f={f} x={move} y={610} size={190} hot={hot} label={hot > 0.5 ? '烫嘴' : '温吞'} steam={hot} />
          {ghost > 0.02 && (
            <g opacity={ghost}>
              <MilkGlassG f={f} x={770} y={610} size={150} hot={1} label="左边" labelSize={22} steam={0.7} dim={0.35} />
              <MilkGlassG f={f} x={1150} y={610} size={150} hot={0.06} label="右边" labelSize={22} steam={0} dim={0.35} />
            </g>
          )}
        </svg>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="深夜厨房" en="One glass of milk" />
      <CiteLine f={f} at={fbt(16)} line1={`${MICROWAVE.freqGHz} GHz · Standing wave`} line2="看不见的靶心 · 示意" />
    </AbsoluteFill>
  );
};

/* ================= 标题 ================= */
export const TitleScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.title;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={600} r={PLATE_R + 20} fill="rgba(10,7,5,0.45)" stroke="rgba(229,201,145,0.14)" strokeWidth={1} />
        <g transform="translate(960 600)">
          <WaveTarget f={f} at={s0 - 90} r={325} hot={0.55} labels={false} spin={(f - s0) * 1.4} dim={0.35} />
        </g>
        <MilkGlassG f={f} x={960} y={600} size={170} hot={0.4} gold steam={0.5} dim={0.45} />
      </svg>
      <ChapterTag f={f} at={s0} cn="黑金光影 · 厨房物理" en="Kitchen physics" />
    </AbsoluteFill>
  );
};

/* ================= 炉腔里的驻波 ================= */
const CAV = {x: 150, y: 280, w: 940, h: 470, cx: 620, waveY: 520, amp: 82, freq: 5};

const wavePath = (phase: number, amp: number) => {
  let d = '';
  for (let i = 0; i <= 240; i++) {
    const u = i / 240;
    const x = CAV.x + 60 + (CAV.w - 80) * u;
    const y = CAV.waveY - amp * Math.sin(u * Math.PI * 2 * CAV.freq + phase);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

const standingPath = (f: number) => {
  let d = '';
  for (let i = 0; i <= 240; i++) {
    const u = i / 240;
    const x = CAV.x + 60 + (CAV.w - 80) * u;
    const y = CAV.waveY - CAV.amp * Math.sin(u * Math.PI * 2 * CAV.freq) * Math.cos(f / 9);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

const WaveCavity: React.FC<{f: number; at: number}> = ({f, at}) => {
  const draw = drawP(f, at, 22);
  const t = f - at;
  const antinodes = [0, 1, 2, 3, 4].map((k) => CAV.x + 60 + ((CAV.w - 80) * (0.25 + k)) / CAV.freq);
  const nodes = [0, 1, 2, 3, 4, 5].map((k) => CAV.x + 60 + ((CAV.w - 80) * k) / CAV.freq);
  return (
    <g>
      {/* 炉腔 */}
      <rect x={CAV.x} y={CAV.y} width={CAV.w} height={CAV.h} fill="rgba(8,6,4,0.45)" stroke="rgba(229,201,145,0.5)" strokeWidth={2} pathLength={1} strokeDasharray={`${draw} 1`} />
      <text x={CAV.x + CAV.w - 20} y={CAV.y + 34} textAnchor="end" fontFamily={BF.latin} fontSize={18} letterSpacing={6} fill="rgba(229,201,145,0.55)">
        CAVITY · 炉腔
      </text>

      {/* 磁控管 + 波导 */}
      <g opacity={clamp01((t - 6) / 14)}>
        <rect x={54} y={556} width={86} height={104} fill="rgba(20,14,9,0.9)" stroke={B.goldLine} strokeWidth={2} />
        <text x={97} y={686} textAnchor="middle" fontFamily={BF.latin} fontSize={11} letterSpacing={1} fill="rgba(229,201,145,0.7)">
          MAGNETRON
        </text>
        <text x={97} y={708} textAnchor="middle" fontFamily={BF.cn} fontSize={18} fill={B.inkDim}>
          磁控管
        </text>
        <path d="M140 608 L196 608" stroke={B.gold} strokeWidth={3} markerEnd="url(#mwg)" style={{filter: `drop-shadow(0 0 6px ${B.gold})`}} />
        <defs>
          <marker id="mwg" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill={B.gold} />
          </marker>
        </defs>
      </g>

      {/* 两列相向的波 + 叠出来的驻波 */}
      <g opacity={clamp01((t - 4) / 18)}>
        <path d={wavePath(t / 7, CAV.amp * 0.55)} fill="none" stroke={B.gold} strokeWidth={2} opacity={0.5} strokeDasharray="7 7" />
        <path d={wavePath(-t / 7, CAV.amp * 0.55)} fill="none" stroke={B.cyan} strokeWidth={2} opacity={0.45} strokeDasharray="7 7" />
        <path d={standingPath(f)} fill="none" stroke={B.ink} strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 8px rgba(255,240,210,0.8))`}} />
      </g>

      {/* 热点 / 凉点 */}
      <g opacity={clamp01((t - 12) / 14)}>
        {antinodes.map((x, i) => (
          <g key={i}>
            <rect x={x - 18} y={CAV.waveY - 185} width={36} height={370} fill="rgba(255,90,60,0.08)" />
            <line x1={x} y1={CAV.waveY - 170} x2={x} y2={CAV.waveY + 170} stroke="rgba(255,122,99,0.65)" strokeWidth={2} opacity={0.55 + 0.35 * Math.sin(f / 8 + i)} />
            <circle cx={x} cy={CAV.waveY} r={7} fill="#ffb39e" opacity={0.85} style={{filter: 'drop-shadow(0 0 10px #ff7a63)'}} />
          </g>
        ))}
        {nodes.map((x, i) => (
          <line key={i} x1={x} y1={CAV.waveY - 150} x2={x} y2={CAV.waveY + 150} stroke="rgba(111,224,210,0.35)" strokeWidth={1.4} strokeDasharray="3 8" />
        ))}
      </g>

      {/* 底部转盘和一杯牛奶（侧视简画） */}
      <g opacity={clamp01((t - 16) / 14)}>
        <ellipse cx={CAV.cx} cy={730} rx={190} ry={26} fill="rgba(12,8,5,0.8)" stroke="rgba(229,201,145,0.35)" strokeWidth={1.4} />
        <path d={`M${CAV.cx - 40} 640 L${CAV.cx - 26} 716 L${CAV.cx + 26} 716 L${CAV.cx + 40} 640 Z`} fill="rgba(255,247,230,0.86)" stroke="rgba(255,250,240,0.5)" strokeWidth={2} />
        <path d={`M${CAV.cx - 26} 700 L${CAV.cx + 26} 700`} stroke={B.gold} strokeWidth={2} opacity={0.7} />
        {[0, 1].map((i) => {
          const k = ((f * 0.5 + i * 26) % 60) / 60;
          return (
            <path
              key={i}
              d={`M${CAV.cx - 8 + i * 16} ${630 - k * 46} q 8 -14 0 -26`}
              fill="none"
              stroke={B.inkDim}
              strokeWidth={2}
              opacity={(1 - k) * 0.5}
            />
          );
        })}
      </g>
    </g>
  );
};

export const WaveScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.wave;
  const out = s1 - 14;
  const targetAt = fbt(48);
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <WaveCavity f={f} at={s0} />
        <g transform="translate(1560 560)">
          <WaveTarget f={f} at={targetAt} r={228} hot={0.9} labels={f >= targetAt + 6} out={out} spin={(f - targetAt) * 0.8} />
        </g>
        <g opacity={clamp01((f - fbt(56)) / 14)}>
          <MilkGlassG f={f} x={1470} y={560} size={100} hot={1} label="烫" labelSize={20} steam={0.8} out={out} />
          <MilkGlassG f={f} x={1650} y={560} size={100} hot={0.06} label="温" labelSize={20} steam={0} out={out} />
        </g>
        <line x1={1210} y1={330} x2={1210} y2={790} stroke="rgba(229,201,145,0.16)" strokeWidth={1} strokeDasharray="3 10" opacity={clamp01((f - targetAt) / 10)} />
      </svg>
      <ChapterTag f={f} at={s0} cn="01 · 看不见的靶心" en="Standing waves" out={out} />
      <CiteLine f={f} at={s0 + 6} line1="2.45 GHz · λ ≈ 12.2 cm · λ/2 ≈ 6.1 cm" line2="波峰是热点，波谷是凉点" out={out} />
      <div style={{position: 'absolute', left: CAV.x + 30, width: 220, top: CAV.y - 44, opacity: clamp01((f - s0 - 16) / 14)}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 26, ...glowText(B.red, 10, 0.7)}}>波峰 · 烫</span>
      </div>
      <div style={{position: 'absolute', left: CAV.x + 30, width: 220, top: CAV.y + CAV.h + 10, opacity: clamp01((f - s0 - 16) / 14)}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 26, ...glowText(B.cyan, 10, 0.7)}}>波谷 · 凉</span>
      </div>
      <div style={{position: 'absolute', left: CAV.x + CAV.w - 270, width: 250, top: CAV.waveY + 130, textAlign: 'left', opacity: clamp01((f - targetAt) / 14)}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 28, ...glowText(B.ink, 10, 0.5)}}>叠成驻波</span>
        <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: 18, color: B.inkFaint}}>two waves, one pattern</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 实验：取下转盘，放正中 ================= */
export const ExperimentScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.experiment;
  const out = s1 - 14;
  const cx = 790;
  const cy = 590;
  const r = 330;
  const ghosts = blurIn(f, fbt(88), 16, out, 14).opacity;
  const card = blurIn(f, fbt(80), 16, out, 14).opacity;
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${cx} ${cy})`}>
          <WaveTarget f={f} at={s0} r={r} hot={1} labels={f > s0 + 12} out={out} spin={(f - s0) * 0.25} />
          {/* 转盘被取走：只剩一圈虚线 */}
          <circle cx={0} cy={0} r={r * 0.99} fill="none" stroke="rgba(229,201,145,0.25)" strokeWidth={2} strokeDasharray="10 12" />
        </g>
        {/* 外圈热点上的幽灵杯 */}
        <g opacity={ghosts}>
          {[
            [18, 0.68],
            [122, 0.68],
            [214, 0.68],
            [308, 0.68],
          ].map(([deg, rad], i) => {
            const a = (deg * Math.PI) / 180;
            return (
              <MilkGlassG
                key={i}
                f={f}
                x={cx + Math.cos(a) * r * rad}
                y={cy + Math.sin(a) * r * rad}
                size={116}
                hot={0.95}
                label="烫"
                labelSize={20}
                steam={0.5}
                dim={0.35}
              />
            );
          })}
        </g>
        {/* 正中那杯：只有温的 */}
        <MilkGlassG f={f} x={cx} y={cy} size={196} hot={0.12} label="温" at={fbt(72)} out={out} steam={0.15} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: cx - 190,
          top: 120,
          width: 380,
          padding: '12px 0',
          textAlign: 'center',
          border: `2px dashed ${B.goldLine}`,
          background: 'rgba(10,7,5,0.6)',
          opacity: clamp01((f - s0 - 6) / 14),
        }}
      >
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 28, ...glowText(B.goldWarm, 8, 0.6)}}>转盘已取下</span>
        <span style={{fontFamily: BF.latin, fontSize: 15, letterSpacing: 4, color: B.inkFaint, marginLeft: 12}}>TURNTABLE OFF</span>
      </div>
      <ChapterTag f={f} at={s0} cn="02 · 取下转盘" en="Turntable off" out={out} />

      {card > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: card}}>
          <GlowCard f={f} at={fbt(80)} x={1300} y={250} w={450} h={470} color={B.goldWarm} out={out}>
            <div style={{padding: '30px 34px'}}>
              <div style={{fontFamily: BF.latin, fontSize: 16, letterSpacing: 5, color: B.inkFaint}}>{DEMO_TEMP.minutes} MIN · {DEMO_TEMP.note.toUpperCase()}</div>
              <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 38, marginTop: 8, ...glowText(B.ink, 8, 0.5)}}>同一杯，两个位置</div>
              <div style={{marginTop: 30}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BF.cn, fontSize: 26, color: B.inkDim}}>
                  <span>正中间</span>
                  <span style={{fontFamily: BF.latinBold, fontSize: 34, ...glowText(B.cyan, 8)}}>{DEMO_TEMP.centerC}°C</span>
                </div>
                <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginTop: 8}}>
                  <div style={{width: '46%', height: '100%', borderRadius: 6, background: B.cyan, boxShadow: `0 0 14px ${B.cyan}`}} />
                </div>
              </div>
              <div style={{marginTop: 30}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BF.cn, fontSize: 26, color: B.inkDim}}>
                  <span>外圈热点</span>
                  <span style={{fontFamily: BF.latinBold, fontSize: 34, ...glowText(B.red, 8)}}>{DEMO_TEMP.rimC}°C</span>
                </div>
                <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginTop: 8}}>
                  <div style={{width: '86%', height: '100%', borderRadius: 6, background: B.red, boxShadow: `0 0 14px ${B.red}`}} />
                </div>
              </div>
              <div style={{marginTop: 30, fontFamily: BF.cn, fontSize: 20, lineHeight: 1.6, color: B.inkFaint}}>
                读数{DEMO_TEMP.note}。不同机器，靶心的位置不一样；
                <br />
                但正中间常常是那个被忘掉的凉点。
              </div>
            </div>
          </GlowCard>
        </div>
      )}

      <div style={{position: 'absolute', left: cx - 200, width: 400, top: 930, textAlign: 'center', fontFamily: BF.cn, fontSize: 20, color: B.inkFaint, opacity: clamp01((f - fbt(88)) / 12)}}>
        外圈红点：热点 · 示意
      </div>
    </AbsoluteFill>
  );
};

/* ================= 转盘带着杯子绕圈 ================= */
const TraceCard: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = drawP(f, at, 26);
  const zig = (() => {
    let d = '';
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const x = 28 + u * 394;
      const y = 92 - Math.sin(u * Math.PI * 8) * 46;
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  })();
  return (
    <div style={{position: 'absolute', left: 1280, top: 250, width: 460}}>
      <GlowCard f={f} at={at} x={0} y={0} w={460} h={430} color={B.goldWarm}>
        <div style={{padding: '28px 30px'}}>
          <div style={{fontFamily: BF.latin, fontSize: 15, letterSpacing: 5, color: B.inkFaint}}>ONE CUP · ONE LAP</div>
          <div style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 36, marginTop: 6, ...glowText(B.ink, 10, 0.5)}}>同一杯，边走边烫</div>
          <svg width={420} height={190} style={{marginTop: 10, overflow: 'visible'}}>
            <line x1={28} y1={146} x2={422} y2={146} stroke={B.goldLine} strokeWidth={1} />
            <path d={zig} fill="none" stroke={B.red} strokeWidth={3} pathLength={1} strokeDasharray={`${p} 1`} style={{filter: 'drop-shadow(0 0 6px rgba(255,122,99,0.8))'}} />
            <line x1={28} y1={92} x2={28 + 394 * p} y2={92} stroke={B.gold} strokeWidth={3} opacity={clamp01((p - 0.6) / 0.4)} style={{filter: 'drop-shadow(0 0 8px rgba(237,210,135,0.9))'}} />
            <text x={28} y={176} fontFamily={BF.cn} fontSize={18} fill={B.red}>经过热点</text>
            <text x={300} y={176} fontFamily={BF.cn} fontSize={18} fill={B.gold}>一圈平均</text>
          </svg>
          <div style={{fontFamily: BF.cn, fontSize: 21, color: B.inkDim, marginTop: 8}}>每一刻都烫，每一圈就温。</div>
        </div>
      </GlowCard>
    </div>
  );
};

export const OrbitScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.orbit;
  const out = s1 - 14;
  const cx = 700;
  const cy = 590;
  const r = 330;
  const ang = spinAt(f, s0, 90);
  const a = (ang * Math.PI) / 180;
  const gx = cx + Math.cos(a) * 195;
  const gy = cy + Math.sin(a) * 195;
  const hot = hotAt(ang);
  const cardAt = fbt(104);
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={cx} cy={cy} r={PLATE_R} fill="rgba(10,7,5,0.55)" stroke="rgba(229,201,145,0.25)" strokeWidth={1.5} />
        <g transform={`translate(${cx} ${cy})`}>
          <WaveTarget f={f} at={s0} r={r} hot={1} labels={false} out={out} spin={ang} />
          {/* 转盘上的三道转痕 */}
          <g transform={`rotate(${ang})`} opacity={0.28}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M0 0 L${Math.cos((i * 120 * Math.PI) / 180) * (PLATE_R - 16)} ${Math.sin((i * 120 * Math.PI) / 180) * (PLATE_R - 16)}`}
                stroke={B.gold}
                strokeWidth={2}
                strokeDasharray="30 26"
              />
            ))}
          </g>
        </g>
        {/* 杯子的轨迹 */}
        <circle cx={cx} cy={cy} r={195} fill="none" stroke="rgba(229,201,145,0.3)" strokeWidth={1.4} strokeDasharray="4 10" />
        {[0, 1, 2].map((k) => {
          const ta = ((ang - 14 * (k + 1)) * Math.PI) / 180;
          return <MilkGlassG key={k} f={f} x={cx + Math.cos(ta) * 195} y={cy + Math.sin(ta) * 195} size={130} hot={hotAt(ang - 14 * (k + 1))} dim={0.78 + k * 0.06} steam={0.4} />;
        })}
        <MilkGlassG f={f} x={gx} y={gy} size={176} hot={hot} label={hot > 0.55 ? '这里烫' : hot > 0.2 ? '经过' : '这里凉'} labelSize={22} steam={hot} out={out} />
      </svg>
      <ChapterTag f={f} at={s0} cn="02 · 轮流去挨烫" en="Orbiting the bullseye" out={out} />
      {f >= cardAt - 8 && <TraceCard f={f} at={cardAt} />}
    </AbsoluteFill>
  );
};

/* ================= 不转 vs 转 ================= */
export const MythScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.myth;
  const out = s1 - 14;
  const ang = spinAt(f, s0, 60, 40);
  const ra = (ang * Math.PI) / 180;
  return (
    <AbsoluteFill style={{opacity: clamp01((f - s0) / 12)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform="translate(480 610)">
          <WaveTarget f={f} at={s0} r={250} hot={1} labels={false} out={out} spin={0} />
          <MilkGlassG f={f} x={150} y={0} size={180} hot={0.5} split={clamp01((f - s0 - 10) / 14)} label="一半烫，一半凉" labelSize={22} steam={0.5} out={out} />
        </g>
        <g transform="translate(1440 610)">
          <WaveTarget f={f} at={s0} r={250} hot={0.45} labels={false} out={out} spin={ang * 1.4} />
          <MilkGlassG f={f} x={Math.cos(ra) * 150} y={Math.sin(ra) * 150} size={180} hot={0.5} gold label="温得均匀" labelSize={22} steam={0.35} out={out} />
          <circle cx={0} cy={0} r={150} fill="none" stroke="rgba(229,201,145,0.3)" strokeWidth={1.2} strokeDasharray="4 10" opacity={clamp01((f - s0) / 14)} />
        </g>
        <line x1={960} y1={310} x2={960} y2={920} stroke="rgba(229,201,145,0.22)" strokeWidth={1} strokeDasharray="3 12" />
      </svg>
      <div style={{position: 'absolute', left: 480 - 220, width: 440, top: 220, textAlign: 'center', opacity: clamp01((f - s0) / 12)}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 38, ...glowText(B.red, 12, 0.7)}}>不转 · 固定位置</span>
        <div style={{fontFamily: BF.latin, fontSize: 16, letterSpacing: 4, color: B.inkFaint, marginTop: 4}}>ONE SIDE BURNS, ONE SIDE STAYS COLD</div>
      </div>
      <div style={{position: 'absolute', left: 1440 - 220, width: 440, top: 220, textAlign: 'center', opacity: clamp01((f - s0) / 12)}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 38, ...glowText(B.gold, 12, 0.7)}}>转 · 轮流经过</span>
        <div style={{fontFamily: BF.latin, fontSize: 16, letterSpacing: 4, color: B.inkFaint, marginTop: 4}}>TAKES TURNS, ENDS UP EVEN</div>
      </div>
      <div style={{position: 'absolute', left: 960 - 60, width: 120, top: 540, textAlign: 'center', opacity: clamp01((f - s0 - 6) / 14)}}>
        <span style={{fontFamily: BF.latinBold, fontSize: 34, letterSpacing: 4, ...glowText(B.inkDim, 8, 0.5)}}>VS</span>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 收束：推近靶心 ================= */
export const BuildScene: React.FC<{f: number}> = ({f}) => {
  const [s0, s1] = SHOTS.build;
  const push = keyframes(f, [
    [s0, 0],
    [s1, 1],
  ]);
  const ang = spinAt(f, s0, 70, -90);
  const a = (ang * Math.PI) / 180;
  const hot = hotAt(ang);
  return (
    <AbsoluteFill style={{opacity: 0.35 + 0.65 * clamp01((f - s0) / 24)}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.15 * push})`, transformOrigin: '50% 56%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={960} cy={600} r={PLATE_R + 30} fill="rgba(10,7,5,0.5)" stroke="rgba(229,201,145,0.18)" strokeWidth={1.2} />
          <g transform="translate(960 600)">
            <WaveTarget f={f} at={s0 - 200} r={365} hot={1} labels={false} spin={ang} coldPulse={1 + 0.4 * Math.sin(f / 5)} />
          </g>
          <circle cx={960} cy={600} r={215} fill="none" stroke="rgba(229,201,145,0.3)" strokeWidth={1.2} strokeDasharray="4 10" />
          <MilkGlassG f={f} x={960 + Math.cos(a) * 215} y={600 + Math.sin(a) * 215} size={185} hot={hot} steam={hot} />
        </svg>
        <div style={{position: 'absolute', left: 180, width: 300, top: 470, opacity: 0.4, fontFamily: BF.latin, fontSize: 22, letterSpacing: 3, color: B.goldWarm}}>{MICROWAVE.freqGHz} GHz</div>
        <div style={{position: 'absolute', left: 1480, width: 320, top: 640, opacity: 0.4, fontFamily: BF.latin, fontSize: 22, letterSpacing: 3, color: B.goldWarm}}>
          λ/2 ≈ {MICROWAVE.halfWaveCm} cm
        </div>
      </AbsoluteFill>
      <ChapterTag f={f} at={s0} cn="03 · 它没坏" en="Not broken" />
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
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}} opacity={0.55}>
        <g transform="translate(960 545)">
          <WaveTarget f={f} at={s0 - 220} r={440} hot={0.3} labels={false} out={out} spin={(f - s0) * 0.5} dim={0.35} />
        </g>
        <MilkGlassG f={f} x={1310} y={330} size={110} hot={0.5} gold dim={0.4} />
        <MilkGlassG f={f} x={610} y={760} size={110} hot={0.5} gold dim={0.45} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 46%, rgba(120,80,40,0.22) 0%, rgba(0,0,0,0) 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 218, textAlign: 'center', opacity: reveal * 0.8, fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.45em', color: B.goldWarm}}>
        THE TURNTABLE MYTH
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: reveal, filter: `blur(${(1 - reveal) * 8}px)`}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 78, letterSpacing: 4, ...glowText(B.ink, 12, 0.6)}}>{QUOTE_1}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', opacity: reveal, transform: `scale(${1.02 - 0.02 * reveal})`, filter: `blur(${(1 - reveal) * 8}px)`}}>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 96, letterSpacing: 6, ...glowText(B.ink, 14, 0.6)}}>是让食物</span>
        <span style={{fontFamily: BF.cn, fontWeight: 900, fontSize: 102, letterSpacing: 8, ...glowText('#ffb08c', 26, 1)}}>轮流去挨烫。</span>
      </div>
      <div style={{position: 'absolute', left: 960 - 520, width: 1040, top: 610, height: 1, background: 'linear-gradient(90deg, rgba(229,201,145,0) 0%, rgba(229,201,145,0.55) 50%, rgba(229,201,145,0) 100%)', opacity: reveal}} />
      <div style={{position: 'absolute', left: 960 - 560, width: 1120, top: 640, textAlign: 'center', opacity: reveal * 0.75, fontFamily: BF.latin, fontStyle: 'italic', fontSize: 26, lineHeight: 1.5, color: B.inkDim}}>
        {QUOTE_EN}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 结尾 ================= */
export const EndScene: React.FC<{f: number}> = ({f}) => {
  const [s0] = SHOTS.end;
  const ang = spinAt(f, s0, 30, 70);
  const a = (ang * Math.PI) / 180;
  const dimQ = clamp01((f - fbt(236)) / 20);
  return (
    <AbsoluteFill style={{opacity: (0.45 + 0.55 * clamp01((f - s0) / 20)) * (1 - 0.3 * dimQ)}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={580} r={PLATE_R + 10} fill="rgba(10,7,5,0.55)" stroke="rgba(229,201,145,0.2)" strokeWidth={1.4} />
        <g transform="translate(960 580)">
          <WaveTarget f={f} at={s0} r={330} hot={0.22} labels={false} spin={ang} dim={0.15} />
        </g>
        <circle cx={960} cy={580} r={185} fill="none" stroke="rgba(229,201,145,0.25)" strokeWidth={1.2} strokeDasharray="4 10" />
        <MilkGlassG f={f} x={960 + Math.cos(a) * 185} y={580 + Math.sin(a) * 185} size={190} hot={0.5} gold steam={0.5} label="谢谢" labelSize={24} />
        <circle cx={960} cy={580} r={380} fill="none" stroke={B.goldLine} strokeWidth={1} opacity={0.5} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 46% 40% at 50% 54%, rgba(170,120,50,0.22) 0%, rgba(0,0,0,0) 72%)'}} />
    </AbsoluteFill>
  );
};
