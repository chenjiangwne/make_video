import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BGCaption, Grain, SmokeBg, SparkTitle} from '../../library/blackgold/stage';
import {B, BF} from '../../library/blackgold/theme';
import {
  CUES,
  SFX,
  SHOTS,
  TITLE,
  TITLE_EN,
  TITLE_SUB,
  cueEnd,
  cueStart,
  fr,
} from './timeline';
import {AdviceScene, HookScene, OutroScene, Scenario1Scene, Scenario2Scene, Scenario3Scene, SummaryScene, TypesScene} from './scenes';

/**
 * ep54 国家债务爆雷（40 秒试片）
 * 先验证 story_board 的 0–40s：钩子 + 内债/外债；通过后再扩展到 180s。
 */
const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

export type Ep54Props = {
  captions?: boolean;
  mix?: 'all' | 'bgm' | 'sfx';
};

export const Ep54DebtStory: React.FC<Ep54Props> = ({captions = true, mix = 'all'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden', scale: 0.997}}>
      {(mix === 'all' || mix === 'bgm') && <Audio src={staticFile('audio/ep54-national-debt-story/bgm.wav')} />}
      {mix !== 'bgm' &&
        SFX.map(([file, at, vol], i) => (
          <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
            <Audio src={staticFile(file)} volume={vol} />
          </Sequence>
        ))}

      <SmokeBg f={f} tone={f >= fr(74) && f < fr(144) ? 'red' : 'warm'} focus={[70, 70]} />

      <AbsoluteFill>
        {inShot(f, SHOTS.hook) && <HookScene f={f} />}
        {inShot(f, SHOTS.types) && <TypesScene f={f} />}
        {inShot(f, SHOTS.s1) && <Scenario1Scene f={f} />}
        {inShot(f, SHOTS.s2) && <Scenario2Scene f={f} />}
        {inShot(f, SHOTS.s3) && <Scenario3Scene f={f} />}
        {inShot(f, SHOTS.advice) && <AdviceScene f={f} />}
        {inShot(f, SHOTS.summary) && <SummaryScene f={f} />}
        {inShot(f, SHOTS.outro) && <OutroScene f={f} />}
      </AbsoluteFill>

      <SparkTitle f={f} at={fr(0.6)} title={TITLE} en={TITLE_EN} sub={TITLE_SUB} y={360} size={110} out={fr(6.5)} instant />

      {captions &&
        CUES.map(([frame, cn, en], i) => {
          const a = cueStart(i);
          const e = cueEnd(i);
          if (f < a - 2 || f > e + 14) return null;
          const last = i === CUES.length - 1;
          return <BGCaption key={frame} f={f} at={a} text={cn} en={en} out={last ? undefined : e - 12} y={last ? 878 : 950} size={last ? 64 : 56} />;
        })}

      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 74% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none'}} />
      <Grain />

      <div style={{position: 'absolute', left: 60, bottom: 40, fontFamily: BF.latin, fontSize: 15, letterSpacing: '0.35em', color: 'rgba(229,201,145,0.35)'}}>
        WEILANX · DEBT STORY 054
      </div>
      <div style={{position: 'absolute', right: 60, bottom: 34, textAlign: 'right', opacity: 0.5, fontFamily: BF.cn, fontSize: 16, color: B.inkFaint}}>
        示意 · 不是投资建议
      </div>
    </AbsoluteFill>
  );
};
