// ep53 国债的账单：120 BPM 程序化配乐（本项目的 bgm.mjs），无口播。
// 段落：钩子明亮 → 标题留白 → 三张账单律动 → 政府/银行/家庭逐渐紧张 → 本币/外币 → 144 秒爆点回亮 → 结尾留白。
// 音效：impact / riser / tick 由 makeTacticalSfx 生成；paper / stamp / whoosh / ding 用共享音效。
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderArrangement} from '../bgm.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';
import {SR, encodeWav} from '../synth.mjs';

const EP = 'ep53-national-debt';
const SECONDS = 180;
const sections = [
  [0, 'bright'],
  [8, 'light'],
  [16, 'break'],
  [20, 'groove'],
  [40, 'tense'],
  [60, 'tense'],
  [88, 'light'],
  [112, 'tense'],
  [136, 'tense'],
  [144, 'bright'],
  [152, 'light'],
  [164, 'break'],
  [176, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
mkdirSync(dir, {recursive: true});

const raw = join(tmpdir(), `${EP}-raw.wav`);
writeFileSync(raw, encodeWav(renderArrangement(SECONDS, sections), SR));
execFileSync('ffmpeg', [
  '-v', 'error', '-y', '-i', raw,
  '-af', `afade=t=in:st=0:d=0.4,afade=t=out:st=${SECONDS - 2.5}:d=2.5,loudnorm=I=-16:TP=-1.5:LRA=11`,
  '-ar', '48000', '-ac', '2', join(dir, 'bgm.wav'),
]);
console.log(`wrote ${EP}/bgm.wav (${SECONDS}s @ -16 LUFS)`);

makeTacticalSfx(EP);
console.log(`wrote ${EP}/ impact riser tick`);
