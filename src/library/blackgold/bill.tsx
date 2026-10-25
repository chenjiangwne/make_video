import React from 'react';
import {rand} from '../anim';
import {B, BF, blurIn, glowText} from './theme';

/**
 * 黑金光影风的「账单 / 钱包」道具（ep53 国债起）：
 * BillG 一张会发光的欠条 / 预算单 / 收据；WalletG 一只装着存款的钱包。
 * 坐标是 1920×1080 舞台坐标；所有动画由帧号算出。
 */

export const BillG: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  title?: string;
  subtitle?: string;
  amount?: string;
  lines?: string[];
  stamp?: string;
  color?: string;
  out?: number;
  tilt?: number;
  dim?: number;
}> = ({
  f,
  at,
  x,
  y,
  w = 440,
  h = 280,
  title = 'DEBT',
  subtitle,
  amount,
  lines = [],
  stamp,
  color = B.red,
  out,
  tilt = -2,
  dim = 0,
}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const s = 0.9 + 0.1 * a.v;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`} opacity={a.opacity * (1 - dim)} style={{filter: a.filter}}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="rgba(14,9,6,0.94)" stroke={color} strokeWidth={2.2} style={{filter: `drop-shadow(0 0 18px ${color}66)`}} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={6} fill="none" stroke="rgba(229,201,145,0.22)" strokeWidth={1} />
      <text x={-w / 2 + 30} y={-h / 2 + 44} fontFamily={BF.latin} fontSize={13} letterSpacing={5} fill="rgba(229,201,145,0.55)">
        {subtitle ?? 'INVOICE · 账单'}
      </text>
      <text x={-w / 2 + 30} y={-h / 2 + 86} fontFamily={BF.cn} fontWeight={900} fontSize={34} fill={B.ink} style={{filter: `drop-shadow(0 0 8px ${B.ink})`}}>
        {title}
      </text>
      <line x1={-w / 2 + 30} y1={-h / 2 + 102} x2={w / 2 - 30} y2={-h / 2 + 102} stroke="rgba(229,201,145,0.35)" strokeWidth={1} />
      {lines.map((l, i) => (
        <g key={i}>
          <circle cx={-w / 2 + 36} cy={-h / 2 + 128 + i * 30} r={2.5} fill={color} />
          <text x={-w / 2 + 48} y={-h / 2 + 134 + i * 30} fontFamily={BF.cn} fontSize={20} fill={B.inkDim}>
            {l}
          </text>
        </g>
      ))}
      {amount && (
        <text x={w / 2 - 30} y={h / 2 - 34} textAnchor="end" fontFamily={BF.latinBold} fontSize={44} fill={color} style={{filter: `drop-shadow(0 0 12px ${color})`}}>
          {amount}
        </text>
      )}
      {/* 条形码 */}
      <g opacity={0.5} transform={`translate(${-w / 2 + 30} ${h / 2 - 34})`}>
        {Array.from({length: 22}, (_, i) => (
          <rect key={i} x={i * 5} y={0} width={1.3 + rand(i + 3) * 2} height={18} fill="rgba(229,201,145,0.8)" />
        ))}
      </g>
      {stamp && (
        <g transform={`translate(${w / 2 - 92} ${-h / 2 + 82}) rotate(-14)`} opacity={0.9}>
          <circle cx={0} cy={0} r={44} fill="none" stroke={color} strokeWidth={3} style={{filter: `drop-shadow(0 0 10px ${color})`}} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={color} strokeWidth={1} opacity={0.6} />
          <text x={0} y={7} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={24} fill={color} style={{filter: `drop-shadow(0 0 6px ${color})`}}>
            {stamp}
          </text>
        </g>
      )}
    </g>
  );
};

export const WalletG: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  size?: number;
  hot?: number;
  label?: string;
  out?: number;
  dim?: number;
}> = ({f, at, x, y, size = 230, hot = 0, label, out, dim = 0}) => {
  const a = blurIn(f, at, 16, out);
  if (a.v <= 0) return null;
  const c = hot > 0.5 ? B.red : B.cyan;
  const w = size * 1.45;
  const h = size * 0.92;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * a.v})`} opacity={a.opacity * (1 - dim)} style={{filter: a.filter}}>
      <ellipse cx={0} cy={h * 0.55} rx={w * 0.48} ry={h * 0.12} fill={c} opacity={0.12 * (0.4 + hot)} style={{filter: 'blur(12px)'}} />
      {/* 露出来的钞票 */}
      <g transform={`translate(${-w * 0.18} ${-h * 0.42}) rotate(-8)`}>
        <rect x={-w * 0.34} y={-h * 0.12} width={w * 0.68} height={h * 0.34} rx={3} fill="rgba(255,247,230,0.92)" stroke="rgba(229,201,145,0.55)" strokeWidth={1.5} />
        <circle cx={0} cy={h * 0.05} r={h * 0.09} fill="none" stroke="rgba(90,64,30,0.7)" strokeWidth={2} />
        <text x={0} y={h * 0.1} textAnchor="middle" fontFamily={BF.latinBold} fontSize={h * 0.1} fill="rgba(70,48,22,0.85)">
          ¥
        </text>
      </g>
      {/* 钱包主体 */}
      <path d={`M${-w / 2} ${-h * 0.28} q0 -${h * 0.14} ${w * 0.12} -${h * 0.14} h${w * 0.76} q${w * 0.12} 0 ${w * 0.12} ${h * 0.14} v${h * 0.54} q0 ${h * 0.14} -${w * 0.12} ${h * 0.14} h-${w * 0.76} q-${w * 0.12} 0 -${w * 0.12} -${h * 0.14} Z`} fill="rgba(30,18,11,0.96)" stroke={c} strokeWidth={2.5} style={{filter: `drop-shadow(0 0 14px ${c}88)`}} />
      <rect x={-w * 0.42} y={h * 0.12} width={w * 0.84} height={h * 0.16} rx={h * 0.08} fill="rgba(10,6,4,0.85)" stroke="rgba(229,201,145,0.35)" strokeWidth={1} />
      <circle cx={w * 0.34} cy={h * 0.2} r={h * 0.065} fill={c} style={{filter: `drop-shadow(0 0 8px ${c})`}} />
      {label && (
        <text x={0} y={h * 0.92} textAnchor="middle" fontFamily={BF.cn} fontWeight={900} fontSize={26} fill={hot > 0.5 ? '#ffb39e' : '#9ff5ec'} style={glowText(hot > 0.5 ? B.red : B.cyan, 8, 0.6)}>
          {label}
        </text>
      )}
    </g>
  );
};
