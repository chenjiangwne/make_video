import React from 'react';
import {clamp01, easeOut} from '../anim';
import {B, BF, drawP} from './theme';

/**
 * 黑金光影风的「微波靶心」：几圈细金环 + 一圈圈红金色热点 + 中心青色的凉斑。
 * 热点是散在圈上的光斑（不是完整的圆环），所以食物绕圈时才会轮流经过热 / 凉。
 * 转盘刻度单独画在最下面，用 spin（度）旋转；靶心本身固定不动，这正是片子的意思。
 * 一个组件同时给「钩子 / 实验 / 绕圈 / 结尾」四段复用，坐标以圆心为原点。
 */

const D2R = Math.PI / 180;

/** 热点相对外圈半径的位置：[角度, 半径比例, 大小] */
const SPOTS: [number, number, number][] = [
  [18, 0.4, 0.085],
  [70, 0.68, 0.075],
  [122, 0.4, 0.09],
  [168, 0.68, 0.075],
  [214, 0.4, 0.085],
  [262, 0.68, 0.08],
  [308, 0.4, 0.09],
  [350, 0.68, 0.075],
  [44, 0.68, 0.05],
  [136, 0.68, 0.05],
  [228, 0.68, 0.05],
  [320, 0.68, 0.05],
];

const COLD: [number, number][] = [
  [0, 0],
  [90, 0.55],
  [180, 0.55],
  [270, 0.55],
];

export const WaveTarget: React.FC<{
  f: number;
  at: number;
  r?: number;
  out?: number;
  labels?: boolean;
  /** 转盘刻度旋转角度（度） */
  spin?: number;
  /** 热点亮度 0..1，结尾可以慢慢褪成暖金 */
  hot?: number;
  /** 整体压暗 0..1 */
  dim?: number;
  /** 画不画转盘刻度 */
  plateTicks?: boolean;
  /** 冷斑是否闪 */
  coldPulse?: number;
}> = ({f, at, r = 320, out, labels = true, spin = 0, hot = 1, dim = 0, plateTicks = true, coldPulse = 1}) => {
  const t = f - at;
  if (t < 0) return null;
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  if (o <= 0) return null;
  const rings = [0.3, 0.52, 0.74, 0.94];

  return (
    <g opacity={o * (1 - dim)}>
      {/* 转盘刻度：和靶心反向旋转，提醒观众「靶心不动，是盘在转」 */}
      {plateTicks && (
        <g transform={`rotate(${spin})`} opacity={0.42}>
          {Array.from({length: 40}, (_, i) => {
            const a = i * 9 * D2R;
            const major = i % 5 === 0;
            const r0 = r * (major ? 0.995 : 1.02);
            const r1 = r * 0.96;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * r1}
                y2={Math.sin(a) * r1}
                stroke={major ? B.gold : 'rgba(229,201,145,0.5)'}
                strokeWidth={major ? 2.4 : 1.2}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={0} cy={0} r={r * 1.035} fill="none" stroke="rgba(229,201,145,0.18)" strokeWidth={1} strokeDasharray="3 9" />
        </g>
      )}

      {/* 靶心环：逐圈画出来 */}
      {rings.map((k, i) => {
        const p = drawP(f, at + i * 3, 14);
        if (p <= 0) return null;
        return (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={r * k}
            fill="none"
            stroke={i === rings.length - 1 ? 'rgba(229,201,145,0.75)' : 'rgba(229,201,145,0.34)'}
            strokeWidth={i === rings.length - 1 ? 2.5 : 1.2}
            pathLength={1}
            strokeDasharray={`${p} 1`}
            transform="rotate(-90)"
          />
        );
      })}

      {/* 十字准星 */}
      <g opacity={clamp01((t - 10) / 16) * 0.6}>
        <line x1={-r * 1.12} y1={0} x2={r * 1.12} y2={0} stroke="rgba(229,201,145,0.28)" strokeWidth={1} strokeDasharray="4 12" />
        <line x1={0} y1={-r * 1.12} x2={0} y2={r * 1.12} stroke="rgba(229,201,145,0.28)" strokeWidth={1} strokeDasharray="4 12" />
        {Array.from({length: 8}, (_, i) => {
          const a = (i * 45) * D2R;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r * 1.02}
              y1={Math.sin(a) * r * 1.02}
              x2={Math.cos(a) * r * 1.09}
              y2={Math.sin(a) * r * 1.09}
              stroke={B.gold}
              strokeWidth={2}
              opacity={0.6}
            />
          );
        })}
      </g>

      {/* 热点 */}
      {SPOTS.map(([deg, rad, size], i) => {
        const a = (deg + (i % 2 ? 4 : -4) * Math.sin(t / 70 + i)) * D2R;
        const cx = Math.cos(a) * r * rad;
        const cy = Math.sin(a) * r * rad;
        const pulse = 0.78 + 0.22 * Math.sin(t / 8 + i * 1.4);
        const rr = r * size;
        return (
          <g key={i} opacity={hot * pulse}>
            <circle cx={cx} cy={cy} r={rr * 2.4} fill="#ff5a3c" opacity={0.1} style={{filter: 'blur(12px)'}} />
            <circle cx={cx} cy={cy} r={rr * 1.5} fill="#ff6a45" opacity={0.18} style={{filter: 'blur(6px)'}} />
            <circle cx={cx} cy={cy} r={rr} fill="none" stroke="#ff9a6f" strokeWidth={2} opacity={0.75} />
            <circle cx={cx} cy={cy} r={rr * 0.55} fill="#ffd9a8" opacity={0.8} />
            <circle cx={cx} cy={cy} r={rr * 0.22} fill="#fff6e0" />
          </g>
        );
      })}

      {/* 中心冷斑：这里就是「放正中只有温的」的那个点 */}
      {COLD.map(([deg, rad], i) => {
        const a = deg * D2R;
        const cx = Math.cos(a) * r * rad;
        const cy = Math.sin(a) * r * rad;
        const pulse = (0.7 + 0.3 * Math.sin(t / 12 + i * 2)) * coldPulse;
        return (
          <g key={i} opacity={0.55 + 0.45 * pulse}>
            <circle cx={cx} cy={cy} r={r * (i === 0 ? 0.11 : 0.055)} fill="#3ad0c2" opacity={0.12} style={{filter: 'blur(8px)'}} />
            <circle cx={cx} cy={cy} r={r * (i === 0 ? 0.035 : 0.018)} fill="#9ff5ec" opacity={0.9} />
            {i === 0 && <circle cx={cx} cy={cy} r={r * 0.085} fill="none" stroke={B.cyan} strokeWidth={1.4} opacity={0.55} />}
          </g>
        );
      })}

      {labels && (
        <>
          <text x={0} y={-r - 22} textAnchor="middle" fontFamily={BF.latin} fontSize={20} letterSpacing={10} fill="rgba(229,201,145,0.72)">
            BULLSEYE
          </text>
          <text x={r * 0.72} y={-r * 0.14} textAnchor="middle" fontFamily={BF.latinBold} fontSize={22} letterSpacing={4} fill={B.red} opacity={0.85}>
            HOT
          </text>
          <text x={0} y={30} textAnchor="middle" fontFamily={BF.latinBold} fontSize={20} letterSpacing={4} fill={B.cyan} opacity={0.85}>
            COLD
          </text>
        </>
      )}
    </g>
  );
};

/**
 * 一杯牛奶（俯视）：杯口、奶面、热气、冷热光晕、温度小签。
 * hot 0 = 凉（青），1 = 烫（红）；split 1 = 一半烫一半凉（固定位置那杯）；
 * label 写在杯子下面；at / out 控制柔入淡出；steam 控制热气。
 */
export const MilkGlassG: React.FC<{
  f: number;
  x?: number;
  y?: number;
  size?: number;
  hot?: number;
  split?: number;
  label?: string;
  labelSize?: number;
  steam?: number;
  at?: number;
  out?: number;
  dim?: number;
  /** 均匀的暖金（转盘转出来的那杯） */
  gold?: boolean;
}> = ({f, x = 0, y = 0, size = 200, hot = 0, split = 0, label, labelSize = 26, steam = 1, at, out, dim = 0, gold = false}) => {
  const r = size / 2;
  const t = f - (at ?? 0);
  const a = at === undefined ? 1 : easeOut(clamp01(t / 14));
  const o = out === undefined ? 1 : 1 - clamp01((f - out) / 12);
  if (a * o <= 0) return null;
  const c = gold ? B.gold : hot > 0.5 ? B.red : B.cyan;
  const hotGlow = gold ? 0.35 : clamp01(hot) * 0.55;
  const coldGlow = gold ? 0 : clamp01(1 - hot) * 0.4;

  return (
    <g transform={`translate(${x} ${y}) scale(${0.86 + 0.14 * a})`} opacity={a * o * (1 - dim)}>
      {/* 冷热光晕 */}
      <circle cx={0} cy={0} r={r * 1.45} fill={B.red} opacity={hotGlow * 0.22} style={{filter: 'blur(16px)'}} />
      <circle cx={0} cy={0} r={r * 1.25} fill={B.cyan} opacity={coldGlow * 0.22} style={{filter: 'blur(14px)'}} />
      <circle cx={0} cy={0} r={r * 1.08} fill="none" stroke={c} strokeWidth={2.5} opacity={0.55} style={{filter: `drop-shadow(0 0 10px ${c})`}} />

      {/* 杯身（俯视） */}
      <circle cx={0} cy={0} r={r} fill="rgba(12,8,5,0.75)" stroke="rgba(255,250,240,0.55)" strokeWidth={3} />
      <circle cx={0} cy={0} r={r * 0.92} fill="none" stroke="rgba(255,250,240,0.2)" strokeWidth={1.2} />
      <circle cx={0} cy={0} r={r * 0.8} fill="#fff7e6" opacity={0.92} />
      <circle cx={0} cy={0} r={r * 0.8} fill={c} opacity={hot > 0.5 ? 0.18 : 0.08} />

      {/* 奶面高光 */}
      <path d={`M${-r * 0.5} ${-r * 0.18} a ${r * 0.55} ${r * 0.4} 0 0 1 ${r * 0.62} ${-r * 0.12}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={5} strokeLinecap="round" />

      {/* 固定位置那杯：一半烫一半凉 */}
      {split > 0.01 && (
        <g opacity={split}>
          <path d={`M0 ${-r * 0.78} A ${r * 0.78} ${r * 0.78} 0 0 1 0 ${r * 0.78} Z`} fill="rgba(255,90,60,0.78)" />
          <path d={`M0 ${-r * 0.78} A ${r * 0.78} ${r * 0.78} 0 0 0 0 ${r * 0.78} Z`} fill="rgba(58,208,194,0.5)" />
          <line x1={0} y1={-r * 0.78} x2={0} y2={r * 0.78} stroke="rgba(5,3,2,0.6)" strokeWidth={2} strokeDasharray="4 5" />
        </g>
      )}

      {/* 热气：烫的时候才冒 */}
      {steam > 0.01 &&
        [0, 1, 2].map((i) => {
          const k = ((f * 0.55 + i * 21) % 60) / 60;
          const sx = (i - 1) * r * 0.28;
          return (
            <path
              key={i}
              d={`M${sx} ${-r * 0.92 - k * r * 0.7} q ${r * 0.1} ${-r * 0.16} 0 ${-r * 0.3}`}
              fill="none"
              stroke={c}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={clamp01(hot * steam) * (1 - k) * 0.85}
              style={{filter: `drop-shadow(0 0 6px ${c})`}}
            />
          );
        })}

      {label && (
        <text
          x={0}
          y={r * 1.55}
          textAnchor="middle"
          fontFamily={BF.cn}
          fontWeight={900}
          fontSize={labelSize}
          fill={gold ? B.gold : hot > 0.5 ? '#ffb39e' : '#9ff5ec'}
          style={{filter: `drop-shadow(0 0 8px ${c})`}}
        >
          {label}
        </text>
      )}
    </g>
  );
};
