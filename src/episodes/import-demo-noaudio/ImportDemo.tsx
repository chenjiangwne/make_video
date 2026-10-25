import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01, keyframes} from '../../library/anim';
import {BGCaption, Grain, SmokeBg, SparkTitle} from '../../library/blackgold/stage';
import {MilkGlassG, WaveTarget} from '../../library/blackgold/target';
import {B} from '../../library/blackgold/theme';
import {CUES, DURATION, FPS, HOT_ANGLES, SHOTS, TITLE} from './timeline';

/**
 * import.md 示例的三镜无音轨短片（12 秒）：
 * S01 3s 标题「看不见的靶心」→ S02 5s 同一杯牛奶左烫右温 → S03 4s 转盘让杯子轮流经过热点。
 * 没有音频组件；渲染时再加 --muted，交付 MP4 不含 audio stream。
 */

const DEG = Math.PI / 180;

const hotAt = (deg: number) => {
  let best = 0;
  for (const h of HOT_ANGLES) {
    const d = Math.abs(((deg - h + 180) % 360) - 180);
    best = Math.max(best, Math.exp(-Math.pow(d / 22, 2)));
  }
  return best;
};

const TitleShot: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={960} cy={610} r={322} fill="rgba(10,7,5,0.5)" stroke="rgba(229,201,145,0.18)" strokeWidth={1.4} />
      <g transform="translate(960 610)">
        <WaveTarget f={f} at={0} r={330} hot={0.4} labels={false} spin={f * 0.6} dim={0.4} />
      </g>
      <MilkGlassG f={f} x={960} y={610} size={170} hot={0.5} gold dim={0.5} />
    </svg>
    <SparkTitle f={f} at={0} title={TITLE} size={170} y={420} out={78} instant />
  </AbsoluteFill>
);

const MilkShot: React.FC<{f: number}> = ({f}) => {
  const push = keyframes(f, [
    [SHOTS.milk[0], 0],
    [SHOTS.milk[1], 1],
  ]);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.08 * push})`, transformOrigin: '50% 57%'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={610} r={322} fill="rgba(10,7,5,0.55)" stroke="rgba(229,201,145,0.22)" strokeWidth={1.5} />
        <circle cx={960} cy={610} r={294} fill="none" stroke="rgba(255,250,240,0.12)" strokeWidth={1} />
        <g transform="translate(960 610)">
          <WaveTarget f={f} at={SHOTS.milk[0]} r={325} hot={1} labels={false} spin={(f - SHOTS.milk[0]) * 0.5} />
        </g>
        <MilkGlassG f={f} x={760} y={610} size={190} hot={1} label="烫" steam={1} />
        <MilkGlassG f={f} x={1160} y={610} size={190} hot={0.06} label="温" steam={0} />
      </svg>
    </AbsoluteFill>
  );
};

const OrbitShot: React.FC<{f: number}> = ({f}) => {
  const s0 = SHOTS.orbit[0];
  const ang = -90 + ((f - s0) / FPS) * 90;
  const a = ang * DEG;
  const hot = hotAt(ang);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={960} cy={610} r={322} fill="rgba(10,7,5,0.55)" stroke="rgba(229,201,145,0.22)" strokeWidth={1.5} />
        <g transform="translate(960 610)">
          <WaveTarget f={f} at={s0} r={330} hot={1} labels={false} spin={ang} />
        </g>
        <circle cx={960} cy={610} r={195} fill="none" stroke="rgba(229,201,145,0.28)" strokeWidth={1.2} strokeDasharray="4 10" />
        <MilkGlassG f={f} x={960 + Math.cos(a) * 195} y={610 + Math.sin(a) * 195} size={185} hot={hot} steam={hot} />
      </svg>
    </AbsoluteFill>
  );
};

export const ImportDemoNoAudio: React.FC = () => {
  const f = useCurrentFrame();
  const flash = Math.max(
    f >= 240 ? 0.65 * (1 - clamp01((f - 240) / 8)) : 0,
    f >= 300 ? 0.35 * (1 - clamp01((f - 300) / 6)) : 0,
  );
  const endFade = clamp01((f - 348) / 12) * 0.78;

  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
      <SmokeBg f={f} focus={[70, 70]} />

      <AbsoluteFill style={{transform: 'scale(0.998)'}}>
        {f < SHOTS.title[1] && <TitleShot f={f} />}
        {f >= SHOTS.milk[0] && f < SHOTS.milk[1] && <MilkShot f={f} />}
        {f >= SHOTS.orbit[0] && f < DURATION && <OrbitShot f={f} />}
      </AbsoluteFill>

      {/* 硬切 / 卡点闪白（在字幕下面，不挡字） */}
      <AbsoluteFill style={{background: '#fff8e8', opacity: flash, pointerEvents: 'none'}} />

      {/* 字幕 */}
      {CUES.map(([at, text, out]) => (
        <BGCaption key={at} f={f} at={at} text={text} out={out} y={950} size={56} />
      ))}

      {/* 结尾淡出（连字幕一起淡） */}
      <AbsoluteFill style={{background: '#000', opacity: endFade, pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};
