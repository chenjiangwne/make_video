import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain, SmokeBg} from '../../library/blackgold/stage';
import {MilkGlassG, WaveTarget} from '../../library/blackgold/target';
import {B, BF, glowText} from '../../library/blackgold/theme';

/**
 * ep52 竖版 3:4 封面（1080×1440）：上面标题字牌，下面是片中的靶心 + 一烫一温两杯牛奶。
 */
const T = 47;

const Stage: React.FC<{left: number; top: number; scale: number; children: React.ReactNode}> = ({left, top, scale, children}) => (
  <div style={{position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
);

export const Ep52CoverTall: React.FC = () => (
  <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
    <SmokeBg f={T} focus={[50, 40]} strength={1.2} />

    <Stage left={-20} top={480} scale={0.61}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={600} r={330} fill="rgba(10,7,5,0.5)" stroke="rgba(229,201,145,0.24)" strokeWidth={1.6} />
        <g transform="translate(960 600)">
          <WaveTarget f={T} at={0} r={340} hot={1} labels={false} spin={T} />
        </g>
        <MilkGlassG f={T} x={760} y={590} size={225} hot={1} label="烫嘴" labelSize={30} steam={1} />
        <MilkGlassG f={T} x={1160} y={610} size={225} hot={0.05} label="温吞" labelSize={30} steam={0} />
      </svg>
    </Stage>

    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050302 0%, #050302 32%, rgba(5,3,2,0.92) 40%, rgba(5,3,2,0) 48%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 74% 30% at 50% 24%, rgba(170,120,50,0.34) 0%, rgba(0,0,0,0) 72%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,3,2,0.96) 0%, rgba(5,3,2,0.86) 10%, rgba(5,3,2,0) 24%)'}} />
    <div style={{position: 'absolute', inset: 22, border: '1px solid rgba(229,201,145,0.16)'}} />

    <div style={{position: 'absolute', left: 0, right: 0, top: 88, textAlign: 'center'}}>
      <div style={{fontFamily: BF.cn, fontWeight: 700, fontSize: 34, letterSpacing: 12, color: B.inkDim}}>黑金光影 · 厨房物理</div>
      <div
        style={{
          marginTop: 22,
          fontFamily: BF.cn,
          fontWeight: 900,
          fontSize: 146,
          lineHeight: 1.12,
          letterSpacing: 10,
          color: '#ffe9b0',
          textShadow: '0 0 8px #fff4d0, 0 0 30px rgba(240,184,96,0.95), 0 0 80px rgba(214,150,60,0.7), 0 6px 20px rgba(0,0,0,0.8)',
        }}
      >
        看不见的靶心
      </div>
      <div style={{marginTop: 18, fontFamily: BF.cn, fontWeight: 900, fontSize: 58, lineHeight: 1.4, ...glowText(B.ink, 12, 0.5)}}>
        同一杯牛奶，
        <br />
        左边<span style={glowText(B.red, 16)}>烫嘴</span>，右边<span style={glowText(B.cyan, 16)}>温吞</span>
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
          fontSize: 40,
          ...glowText(B.ink, 8, 0.4),
        }}
      >
        微波炉没坏，它只是在碗里画靶心
      </div>
    </div>

    <div style={{position: 'absolute', left: 0, right: 0, bottom: 48, textAlign: 'center'}}>
      <div style={{fontFamily: BF.latin, fontSize: 18, letterSpacing: '0.45em', color: B.goldWarm}}>THE INVISIBLE BULLSEYE</div>
      <div style={{fontFamily: BF.latin, fontStyle: 'italic', fontSize: 22, color: B.inkFaint, marginTop: 8}}>2.45 GHz · turntable · one glass of milk</div>
    </div>
    <Grain />
  </AbsoluteFill>
);
