import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {ShockG} from '../../library/blackgold/pen';
import {BGCaption, FormulaField, GlowSmash, Grain, SmokeBg, SparkTitle, TickRing} from '../../library/blackgold/stage';
import {B, BF} from '../../library/blackgold/theme';
import {barPunch} from '../../library/lamplight/scenes';
import {
  ANCHOR,
  BAR,
  BAR0,
  CUES,
  DARK_FROM,
  DARK_FROM2,
  FPS,
  FREEZE,
  HALF_BEATS,
  HIT,
  HIT2,
  SFX,
  SHOTS,
  TERM,
  TITLE,
  TITLE_EN,
  TITLE_SUB,
  cueEnd,
  cueStart,
  fb,
  fr,
} from './timeline';
import {
  BuildScene,
  EndScene,
  ExperimentScene,
  HookScene,
  MythScene,
  OrbitScene,
  QuoteScene,
  TitleScene,
  WaveScene,
} from './scenes';

/**
 * ep52 看不见的靶心（黑金光影风，无口播，120 秒）：
 * 一杯牛奶左烫右温 → 炉腔里的驻波把热量排成靶心 → 取下转盘放正中只有温的
 * → 转盘让食物轮流去挨烫 → 96 秒砸出「靶心」→ 下次它转，默默谢它一句。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

export type Ep52Props = {
  /** false = 不烧字幕，输出干净画面给后期 */
  captions?: boolean;
  /** all = 配乐 + 音效；bgm = 只要配乐；sfx = 只要音效（配 --codec=wav 用） */
  mix?: 'all' | 'bgm' | 'sfx';
};

export const Ep52Microwave: React.FC<Ep52Props> = ({captions = true, mix = 'all'}) => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const punch = barPunch(f, {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb});
  const redTone = f >= fr(92) && f < HIT2;

  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden', scale: 0.997}}>
      {(mix === 'all' || mix === 'bgm') && <Audio src={staticFile('audio/ep52-microwave-target/bgm.wav')} />}
      {mix !== 'bgm' &&
        SFX.map(([file, at, vol], i) => (
          <Sequence key={i} from={Math.max(0, at)} durationInFrames={file.includes('motor') ? FPS * 16 : 75}>
            <Audio src={staticFile(file)} volume={vol} />
          </Sequence>
        ))}

      <SmokeBg f={ff} tone={redTone ? 'red' : 'warm'} focus={[70, 70]} />

      <AbsoluteFill style={{transform: `scale(${1 + punch})`}}>
        {inShot(f, SHOTS.hook) && <HookScene f={ff} />}
        {inShot(f, SHOTS.title) && <TitleScene f={ff} />}
        {inShot(f, SHOTS.title) && (
          <>
            <FormulaField
              f={f}
              at={HIT}
              items={['2.45 GHz', 'λ ≈ 12.2 cm', 'HOT SPOT', 'COLD SPOT', 'STANDING WAVE', 'NODE', 'ANTINODE', 'TARGET']}
              out={SHOTS.title[1] - 10}
              seed={52}
            />
            <SparkTitle f={f} at={HIT} title={TITLE} en={TITLE_EN} sub={TITLE_SUB} y={420} size={150} out={SHOTS.title[1] - 10} instant />
          </>
        )}
        {inShot(f, SHOTS.wave) && <WaveScene f={ff} />}
        {inShot(f, SHOTS.experiment) && <ExperimentScene f={ff} />}
        {inShot(f, SHOTS.orbit) && <OrbitScene f={ff} />}
        {inShot(f, SHOTS.myth) && <MythScene f={ff} />}
        {inShot(f, SHOTS.build) && <BuildScene f={ff} />}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TickRing f={f} at={HIT2} cy={440} r={410} step={2} out={SHOTS.hit2[1] - 12} />
            <GlowSmash f={f} at={HIT2} text={ANCHOR} size={300} sub={TERM} y={440} />
            <AbsoluteFill style={{pointerEvents: 'none'}}>
              <svg width={1920} height={1080}>
                <ShockG f={f} at={HIT2} x={960} y={440} r={230} color={B.gold} seed={52} />
              </svg>
            </AbsoluteFill>
          </>
        )}
        {inShot(f, SHOTS.quote) && <QuoteScene f={ff} />}
        {inShot(f, SHOTS.end) && <EndScene f={ff} />}
      </AbsoluteFill>

      {/* 字幕：captions=false 时整段不渲染，输出干净画面 */}
      {captions &&
        CUES.map(([b, cn, en], i) => {
          if (!cn) return null;
          const a = cueStart(i);
          const e = HALF_BEATS.includes(b) ? DARK_FROM2 : cueEnd(i);
          if (f < a - 2 || f > e + 14) return null;
          const last = i === CUES.length - 1;
          return (
            <BGCaption
              key={i}
              f={ff}
              at={a}
              text={cn}
              en={en}
              out={HALF_BEATS.includes(b) ? e : last ? undefined : e - 12}
              y={last ? 878 : 950}
              size={last ? 66 : 56}
            />
          );
        })}

      {/* 收暗 + 胶片颗粒 */}
      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 74% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none'}} />
      <Grain />

      {/* 左上角固定系列标签 */}
      <div style={{position: 'absolute', left: 60, bottom: 40, fontFamily: BF.latin, fontSize: 15, letterSpacing: '0.35em', color: 'rgba(229,201,145,0.35)'}}>
        WEILANX · KITCHEN PHYSICS 052
      </div>
      <div style={{position: 'absolute', right: 60, bottom: 34, textAlign: 'right', opacity: 0.5, fontFamily: BF.cn, fontSize: 16, color: B.inkFaint}}>
        示意画面 · 不同机器靶心位置不同
      </div>
    </AbsoluteFill>
  );
};
