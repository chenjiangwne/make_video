import React from 'react';
import {clamp01} from '../anim';
import {BillG} from './bill';
import {B, BF, blurIn, glowText} from './theme';

/**
 * 黑金光影风的「国家小人 / 欠条堆」道具（ep54 起）。
 * CountryG：一个发光的小人 + 抽象旗帜 + 地块，不画真实国旗 / 边界。
 * BillStackG：多张 BillG 依次堆高，最后压住小人。
 */

export const CountryG: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  size?: number;
  burden?: number;
  out?: number;
}> = ({f, at, x, y, size = 200, burden = 0, out}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const s = size / 200;
  const b = clamp01(burden);
  return (
    <g transform={`translate(${x} ${y + b * 10}) scale(${s}) rotate(${-b * 7})`} opacity={a.opacity} style={{filter: a.filter}}>
      <ellipse cx={0} cy={8} rx={72} ry={14} fill={B.gold} opacity={0.12} style={{filter: 'blur(8px)'}} />
      {/* 地块底座 */}
      <path d="M-86 6 Q-70 -8 -40 0 Q-20 8 0 2 Q28 -6 58 2 Q76 6 92 0" fill="none" stroke="rgba(229,201,145,0.45)" strokeWidth={3} strokeLinecap="round" />
      {/* 身体 */}
      <path d="M-38 -8 Q-34 -80 0 -86 Q34 -80 38 -8 Z" fill="rgba(255,241,196,0.9)" style={{filter: 'drop-shadow(0 0 14px rgba(255,230,170,0.8))'}} />
      <circle cx={0} cy={-112} r={28} fill="#fff1c4" style={{filter: 'drop-shadow(0 0 16px rgba(255,230,170,0.95))'}} />
      {/* 眼睛 */}
      <circle cx={-10} cy={-116} r={3.5} fill={B.bg} />
      <circle cx={10} cy={-116} r={3.5} fill={B.bg} />
      {/* 旗杆 + 抽象旗 */}
      <line x1={38} y1={-40} x2={38} y2={-190} stroke={B.gold} strokeWidth={4} strokeLinecap="round" />
      <path d="M38 -188 L112 -174 L38 -150 Z" fill="rgba(255,122,99,0.88)" stroke={B.gold} strokeWidth={2} style={{filter: 'drop-shadow(0 0 10px rgba(255,122,99,0.8))'}} />
      <circle cx={62} cy={-169} r={7} fill="#fff4d0" opacity={0.9} />
      {/* 被压住的姿态：肩膀下沉 */}
      <path d={`M-38 ${-8 - b * 10} Q-78 ${-30 + b * 18} -96 ${-4 + b * 14}`} fill="none" stroke="#fff1c4" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      <path d={`M38 ${-8 - b * 10} Q70 ${-26 + b * 16} 84 ${-2 + b * 12}`} fill="none" stroke="#fff1c4" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      <text x={0} y={48} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={24} fill={B.goldWarm} style={glowText(B.goldWarm, 8, 0.5)}>
        一个国家
      </text>
    </g>
  );
};

export const BillStackG: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  count?: number;
  out?: number;
}> = ({f, at, x, y, count = 8, out}) => {
  return (
    <g>
      {Array.from({length: count}, (_, i) => (
        <BillG
          key={i}
          f={f}
          at={at + i * 4}
          x={x + (i % 2 ? -18 : 16)}
          y={y - i * 17}
          w={250}
          h={150}
          title="IOU"
          subtitle="DEBT NOTE"
          amount="DUE"
          lines={[]}
          stamp={i === count - 1 ? 'DUE' : undefined}
          color={i % 3 === 2 ? B.gold : B.red}
          out={out}
          tilt={i % 2 ? 5 : -4}
        />
      ))}
    </g>
  );
};
