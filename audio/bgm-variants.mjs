// audio/bgm-variants.mjs — 为 ep53 生成 3 条 30 秒 BGM 试听变体（120 BPM，和现有时间线兼容）。
// 不是采样 / AI：全部由 synth.mjs 的振荡器、噪声、包络、滤波与卷积混响合成。
// 输出到 products/one/bgm-variants/，每条 30 秒；响度由 ffmpeg 统一到 -16 LUFS。
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {SR, bass, bell, encodeWav, hat, kick, mixInto, mtof, pluck, reverb, setSeed, shaker, snap, softClip} from './synth.mjs';

const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SECONDS = 30;
const N = Math.round(SECONDS * SR);
const OUT = join(process.cwd(), 'products', 'one', 'bgm-variants');
mkdirSync(OUT, {recursive: true});

// A 小调：Am – F – Dm – E；root 用低音区 MIDI
const PROG = [
  {root: 45, notes: [57, 60, 64]},
  {root: 41, notes: [53, 57, 60]},
  {root: 38, notes: [50, 53, 57]},
  {root: 40, notes: [52, 56, 59]},
];

const fade = (buf, inSec = 0.35, outSec = 1.2) => {
  const a = Math.round(inSec * SR);
  const b = Math.round(outSec * SR);
  for (let i = 0; i < a && i < buf.length; i++) buf[i] *= i / a;
  for (let i = 0; i < b && i < buf.length; i++) buf[buf.length - 1 - i] *= i / b;
  return buf;
};

const finish = (music, drums, wet = 0.22, decay = 0.8) => {
  const mix = new Float32Array(N);
  for (let i = 0; i < N; i++) mix[i] = music[i] * 0.9 + drums[i] * 0.55;
  const out = softClip(reverb(mix, wet, decay), 1.05);
  return encodeWav(fade(out), SR);
};

const renderCinematic = () => {
  setSeed(11);
  const music = new Float32Array(N);
  const drums = new Float32Array(N);
  const K = kick();
  for (let bar = 0; bar < Math.ceil(SECONDS / BAR); bar++) {
    const t0 = bar * BAR;
    const c = PROG[bar % 4];
    // 低频 drone：根音 + 低八度，长音
    mixInto(music, bass(mtof(c.root), 2.6), t0, 0.55);
    mixInto(music, bass(mtof(c.root - 12), 2.8), t0 + 0.02, 0.22);
    // 半速心跳
    mixInto(drums, K, t0, 0.42);
    mixInto(drums, K, t0 + 1.0, 0.22);
    // 稀疏钟声 / 拨弦
    if (bar % 2 === 0) {
      mixInto(music, bell(mtof(c.notes[2] + 12), 2.2), t0 + 0.5, 0.1);
      mixInto(music, bell(mtof(c.notes[1] + 12), 1.8), t0 + 1.5, 0.07);
    }
    if (bar % 4 === 2) mixInto(music, pluck(mtof(c.root + 24), 1.6, 0.35), t0 + 1.0, 0.12);
    // 极轻的沙锤，给时间感
    for (let k = 0; k < 4; k++) mixInto(drums, shaker(), t0 + k * BEAT + 0.25, k % 2 ? 0.04 : 0.07);
  }
  return finish(music, drums, 0.28, 0.82);
};

const renderMinimal = () => {
  setSeed(23);
  const music = new Float32Array(N);
  const drums = new Float32Array(N);
  const K = kick();
  const H = hat();
  for (let bar = 0; bar < Math.ceil(SECONDS / BAR); bar++) {
    const t0 = bar * BAR;
    const c = PROG[bar % 4];
    mixInto(music, bass(mtof(c.root), 2.9), t0, 0.38);
    if (bar % 2 === 0) mixInto(drums, K, t0, 0.28);
    // 呼吸般的和声点
    mixInto(music, bell(mtof(c.notes[0] + 12), 2.6), t0 + 0.1, 0.055);
    mixInto(music, bell(mtof(c.notes[2] + 12), 2.2), t0 + 1.1, 0.045);
    // 轻脉冲：二、四拍
    mixInto(drums, H, t0 + 1 * BEAT, 0.09);
    mixInto(drums, H, t0 + 3 * BEAT, 0.07);
    for (let k = 0; k < 8; k++) mixInto(drums, shaker(), t0 + k * 0.5 * BEAT, 0.025);
    if (bar % 4 === 3) mixInto(music, pluck(mtof(c.root + 19), 1.2, 0.3), t0 + 1.5, 0.08);
  }
  return finish(music, drums, 0.32, 0.86);
};

const renderNews = () => {
  setSeed(37);
  const music = new Float32Array(N);
  const drums = new Float32Array(N);
  const K = kick();
  const H = hat();
  for (let bar = 0; bar < Math.ceil(SECONDS / BAR); bar++) {
    const t0 = bar * BAR;
    const c = PROG[bar % 4];
    // 八分音符低音：root / root+7 交替
    for (let k = 0; k < 8; k++) {
      const n = k % 2 === 0 ? c.root : c.root + 7;
      mixInto(music, bass(mtof(n), 0.26), t0 + k * 0.5 * BEAT, 0.32);
    }
    mixInto(drums, K, t0, 0.6);
    mixInto(drums, K, t0 + 2 * BEAT, 0.42);
    for (let k = 0; k < 8; k++) mixInto(drums, H, t0 + k * 0.5 * BEAT, k % 2 ? 0.08 : 0.14);
    if (bar % 2 === 1) {
      mixInto(music, bell(mtof(c.notes[1] + 12), 0.9), t0 + 1.5, 0.09);
      mixInto(drums, snap(), t0 + 3.5 * BEAT, 0.12);
    }
    if (bar % 4 === 0) mixInto(music, pluck(mtof(c.root + 24), 0.8, 0.7), t0 + 0.5, 0.12);
  }
  return finish(music, drums, 0.12, 0.62);
};

const files = [
  ['01-cinematic-dark.wav', renderCinematic()],
  ['02-minimal-pulse.wav', renderMinimal()],
  ['03-news-urgent.wav', renderNews()],
];
const AF = 'afade=t=in:st=0:d=0.3,afade=t=out:st=29:d=1,loudnorm=I=-16:TP=-1.5:LRA=11';
for (const [name, data] of files) {
  const raw = join(OUT, `${name}.raw.wav`);
  const dst = join(OUT, name);
  writeFileSync(raw, data);
  const af = name.startsWith('01') ? AF + ',volume=1.15,alimiter=limit=0.841:level=disabled' : AF;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-af', af, '-ar', '48000', '-ac', '2', dst], {stdio: 'inherit'});
  unlinkSync(raw);
  console.log(`wrote bgm-variants/${name} (30s @ -16 LUFS, 48k stereo)`);
}

// 现用 BGM 的前 30 秒，做对照
const current = join(process.cwd(), 'public', 'audio', 'ep53-national-debt', 'bgm.wav');
if (existsSync(current)) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', '0', '-t', '30', '-i', current, '-af', AF, '-ar', '48000', '-ac', '2', join(OUT, '00-current.wav')], {stdio: 'inherit'});
  console.log('wrote bgm-variants/00-current.wav (30s @ -16 LUFS, 48k stereo)');
}
