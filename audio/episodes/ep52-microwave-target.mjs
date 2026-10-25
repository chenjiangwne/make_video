// ep52 看不见的靶心：配乐用 bgm.mjs 按 120 BPM 编曲（和 timeline.ts 的网格一致），没有人声。
// 段落：钩子明亮 → 标题留白 → 解释律动 → 实验轻巧 → 转盘律动 → 收束转小调 → 96 秒爆点回到明亮 → 结尾留白。
// 本期音效：beep 按键、ding 到点、slide 杯子滑动、motor 转盘电机；impact / riser / tick / chime 借用通用包。
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderArrangement} from '../bgm.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';
import {SR, encodeWav} from '../synth.mjs';

const EP = 'ep52-microwave-target';
const SECONDS = 120;
const sections = [
  [0, 'bright'],
  [8, 'light'],
  [16, 'break'], // 标题卡
  [18, 'groove'],
  [32, 'light'], // 实验
  [40, 'groove'],
  [48, 'groove'], // 转盘
  [64, 'tense'], // 不转 vs 转
  [80, 'tense'], // 推近靶心
  [96, 'bright'], // 「靶心」砸出
  [104, 'light'], // 大字卡
  [112, 'break'], // 结尾
  [118, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
mkdirSync(dir, {recursive: true});

// 配乐：-16 LUFS，结尾 2.5 秒淡出
const raw = join(tmpdir(), `${EP}-raw.wav`);
writeFileSync(raw, encodeWav(renderArrangement(SECONDS, sections), SR));
execFileSync('ffmpeg', [
  '-v', 'error', '-y', '-i', raw,
  '-af', `afade=t=in:st=0:d=0.4,afade=t=out:st=${SECONDS - 2.5}:d=2.5,loudnorm=I=-16:TP=-1.5:LRA=11`,
  '-ar', '48000', '-ac', '2', join(dir, 'bgm.wav'),
]);
console.log(`wrote ${EP}/bgm.wav (${SECONDS}s @ -16 LUFS)`);

// 通用合成音效（impact / riser / tick / chime 等）
makeTacticalSfx(EP);

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
const tail = 'alimiter=limit=0.5:level=disabled,pan=stereo|c0=c0|c1=c0';

// 按键：短促的一声「嘀」
ff(['-f', 'lavfi', '-i', "aevalsrc='0.55*exp(-40*t)*sin(2*PI*1180*t)':s=48000:d=0.18", '-af', tail, join(dir, 'beep.wav')]);

// 到点：微波炉「叮」
ff([
  '-f', 'lavfi',
  '-i', "aevalsrc='exp(-2.2*t)*(0.5*sin(2*PI*1046*t)+0.28*sin(2*PI*2093*t)+0.12*sin(2*PI*3140*t))':s=48000:d=1.6",
  '-af', tail, join(dir, 'ding.wav'),
]);

// 轻铃：热点亮起、字幕落点用
ff([
  '-f', 'lavfi',
  '-i', "aevalsrc='exp(-3.5*t)*(0.6*sin(2*PI*1046*t)+0.25*sin(2*PI*2093*t)+0.12*sin(2*PI*3140*t))':s=48000:d=1.4",
  '-af', tail, join(dir, 'chime.wav'),
]);

// 杯子滑动：一小段被扫过的噪声
ff([
  '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.8:d=0.45:r=48000',
  '-af', `bandpass=f=1400:width_type=h:w=1900,volume='sin(PI*t/0.45)':eval=frame,${tail}`,
  join(dir, 'slide.wav'),
]);

// 转盘电机：低频嗡鸣 + 一点机械噪声，16 秒，前后淡入淡出
ff([
  '-f', 'lavfi',
  '-i', "aevalsrc='0.16*sin(2*PI*98*t)+0.09*sin(2*PI*196*t)+0.05*sin(2*PI*49*t)+0.04*sin(2*PI*(98+2*sin(2*PI*0.25*t))*t)':s=48000:d=16",
  '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.16:d=16:r=48000',
  '-filter_complex', `[1]lowpass=f=420,volume=0.5[n];[0][n]amix=inputs=2:normalize=0,afade=t=in:st=0:d=0.6,afade=t=out:st=14:d=2,lowpass=f=900,${tail}[o]`,
  '-map', '[o]', join(dir, 'motor.wav'),
]);

console.log(`wrote ${EP}/ beep ding slide motor`);
