import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BillG, WalletG} from '../../library/blackgold/bill';
import {Grain, SmokeBg} from '../../library/blackgold/stage';
import {B, BF, glowText} from '../../library/blackgold/theme';

/** ep53 竖版 3:4 封面：标题 + 一张欠条 + 一只钱包。 */
const T = 53;

const Stage: React.FC<{left: number; top: number; scale: number; children: React.ReactNode}> = ({left, top, scale, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep53CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
    <SmokeBg f={T} focus={[50, 40]} strength={1.2} />

    <Stage left={-20} top={500} scale={0.6}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={560} r={360} fill="none" stroke="rgba(229,201,145,0.16)" strokeWidth={1.5} strokeDasharray="4 12" />
        <BillG f={T} at={0} x={900} y={520} w={640} h={390} title="DEBT" subtitle="SOVEREIGN DEBT · 国债" amount="???" lines={['本金', '利息', '到期滚续']} stamp="DUE" tilt={-3} />
        <WalletG f={T} at={0} x={1470} y={790} size={230} hot={0.85} label="你的存款" />
        <path d="M1180 700 C1280 690 1360 720 1400 760" fill="none" stroke={B.red} strokeWidth={3} strokeDasharray="6 8" />
      </svg>
    </Stage>

    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050302 0%, #050302 32%, rgba(5,3,2,0.92) 40%, rgba(5,3,2,0) 48%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 74% 30% at 50% 24%, rgba(170,120,50,0.34) 0%, rgba(0,0,0,0) 72%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,3,2,0.96) 0%, rgba(5,3,2,0.86) 10%, rgba(5,3,2,0) 24%)'}} />
    <div style={{position: 'absolute', inset: 22, border: '1px solid rgba(229,201,145,0.16)'}} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center'}}>
      <div style={{fontFamily: BF.cn, fontWeight: 700, fontSize: 34, letterSpacing: 12, color: B.inkDim}}>黑金光影 · 宏观账本</div>
      <div
        style={{
          marginTop: 22,
          fontFamily: BF.cn,
          fontWeight: 900,
          fontSize: 158,
          lineHeight: 1.12,
          letterSpacing: 12,
          color: '#ffe9b0',
          textShadow: '0 0 8px #fff4d0, 0 0 30px rgba(240,184,96,0.95), 0 0 80px rgba(214,150,60,0.7), 0 6px 20px rgba(0,0,0,0.8)',
        }}
      >
        国债的账单
      </div>
      <div style={{marginTop: 18, fontFamily: BF.cn, fontWeight: 900, fontSize: 56, lineHeight: 1.4, ...glowText(B.ink, 12, 0.5)}}>
        国家欠债，
        <br />
        最后<span style={glowText(B.red, 16)}>谁买单</span>？
      </div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 30,
          padding: '12px 30px',
          borderRadius: 12,
          background: 'rgba(40,10,6,0.85)',
          border: `3px solid ${B.red}`,
          boxShadow: `0 0 24px ${B.red}66`,
          fontFamily: BF.cn,
          fontWeight: 900,
          fontSize: 38,
          ...glowText(B.ink, 8, 0.4),
        }}
      >
        存款没有消失，只是被重新定价
      </div>
    </div>

    <div style={{position: 'absolute', left: 0, right: 0, bottom: 48, textAlign: 'center'}}>
      <div style={{fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.45em', color: B.goldWarm}}>THE DEBT BILL</div>
      <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: 22, color: B.inkFaint, marginTop: 8}}>sovereign debt · currency · your savings</div>
    </div>
    <Grain />
  </AbsoluteFill>
);
