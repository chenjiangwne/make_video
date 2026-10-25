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
  AftermathScene,
  BankScene,
  BuildScene,
  CurrencyScene,
  EndScene,
  GovScene,
  HookScene,
  HouseholdScene,
  IntroScene,
  QuoteScene,
  TitleScene,
} from './scenes';

/**
 * ep53 国债的账单（黑金光影风，无口播，180 秒）：
 * 一张欠条 → 三张账单 → 政府利息 → 银行—主权循环 → 家庭通胀/利率/就业
 * → 本币 vs 外币 → 144 秒砸出「账单」→ 你的存款没有消失，只是被重新定价了。
 */

const inShot = (f: number, s: readonly [number, number]) => f >= s[0] && f < s[1];

export type Ep53Props = {
  captions?: boolean;
  mix?: 'all' | 'bgm' | 'sfx';
};

export const Ep53Debt: React.FC<Ep53Props> = ({captions = true, mix = 'all'}) => {
  const f = useCurrentFrame();
  const ff = f >= DARK_FROM && f < HIT ? Math.min(f, HIT - FREEZE) : f >= DARK_FROM2 && f < HIT2 ? Math.min(f, HIT2 - FREEZE) : f;
  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const punch = barPunch(f, {hit: HIT, hit2: HIT2, bar: BAR, bar0: BAR0, fps: FPS, fb});
  const redTone = f >= fr(136) && f < HIT2;

  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden', scale: 0.997}}>
      {(mix === 'all' || mix === 'bgm') && <Audio src={staticFile('audio/ep53-national-debt/bgm.wav')} />}
      {mix !== 'bgm' &&
        SFX.map(([file, at, vol], i) => (
          <Sequence key={i} from={Math.max(0, at)} durationInFrames={75}>
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
              items={['DEBT/GDP', 'INTEREST', 'ROLLOVER', 'INFLATION', 'DEFAULT', 'DEPOSIT', 'BILL', 'DUE']}
              out={SHOTS.title[1] - 10}
              seed={53}
            />
            <SparkTitle f={f} at={HIT} title={TITLE} en={TITLE_EN} sub={TITLE_SUB} y={420} size={150} out={SHOTS.title[1] - 10} instant />
          </>
        )}
        {inShot(f, SHOTS.intro) && <IntroScene f={ff} />}
        {inShot(f, SHOTS.gov) && <GovScene f={ff} />}
        {inShot(f, SHOTS.bank) && <BankScene f={ff} />}
        {inShot(f, SHOTS.household) && <HouseholdScene f={ff} />}
        {inShot(f, SHOTS.currency) && <CurrencyScene f={ff} />}
        {inShot(f, SHOTS.build) && <BuildScene f={ff} />}
        {inShot(f, SHOTS.hit2) && (
          <>
            <TickRing f={f} at={HIT2} cy={440} r={410} step={2} out={SHOTS.hit2[1] - 12} />
            <GlowSmash f={f} at={HIT2} text={ANCHOR} size={300} sub={TERM} y={440} />
            <AbsoluteFill style={{pointerEvents: 'none'}}>
              <svg width={1920} height={1080}>
                <ShockG f={f} at={HIT2} x={960} y={440} r={230} color={B.gold} seed={53} />
              </svg>
            </AbsoluteFill>
          </>
        )}
        {inShot(f, SHOTS.aftermath) && <AftermathScene f={ff} />}
        {inShot(f, SHOTS.quote) && <QuoteScene f={ff} />}
        {inShot(f, SHOTS.end) && <EndScene f={ff} />}
      </AbsoluteFill>

      {captions &&
        CUES.map(([b, cn, en], i) => {
          if (!cn) return null;
          const a = cueStart(i);
          const e = cueEnd(i);
          if (f < a - 2 || f > e + 14) return null;
          const last = i === CUES.length - 1;
          return (
            <BGCaption
              key={i}
              f={ff}
              at={a}
              text={cn}
              en={en}
              out={last ? undefined : e - 12}
              y={last ? 878 : 950}
              size={last ? 66 : 56}
            />
          );
        })}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(dark1, dark2), pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 74% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none'}} />
      <Grain />

      <div style={{position: 'absolute', left: 60, bottom: 40, fontFamily: BF.latin, fontSize: 15, letterSpacing: '0.35em', color: 'rgba(229,201,145,0.35)'}}>
        WEILANX · MACRO LEDGER 053
      </div>
      <div style={{position: 'absolute', right: 60, bottom: 34, textAlign: 'right', opacity: 0.5, fontFamily: BF.cn, fontSize: 16, color: B.inkFaint}}>
        示意画面 · 不同国家结构不同
      </div>
    </AbsoluteFill>
  );
};
