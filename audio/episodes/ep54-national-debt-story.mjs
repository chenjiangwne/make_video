// ep54 国家债务爆雷（40 秒试片）：120 BPM 程序化配乐 + 欠条/分栏音效。
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderArrangement} from '../bgm.mjs';
import {makeTacticalSfx} from '../sfx-tactical.mjs';
import {SR, encodeWav} from '../synth.mjs';

const EP = 'ep54-national-debt-story';
const SECONDS = 180;
const sections = [
  [0, 'tense'], // 欠条堆
  [12, 'light'], // 内债 / 外债
  [40, 'groove'],
  [74, 'tense'],
  [110, 'tense'],
  [144, 'light'],
  [164, 'break'],
  [176, 'end'],
];

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
mkdirSync(dir, {recursive: true});
const raw = join(tmpdir(), `${EP}-raw.wav`);
writeFileSync(raw, encodeWav(renderArrangement(SECONDS, sections), SR));
execFileSync('ffmpeg', [
  '-v', 'error', '-y', '-i', raw,
  '-af', `afade=t=in:st=0:d=0.3,afade=t=out:st=${SECONDS - 2}:d=2,loudnorm=I=-16:TP=-1.5:LRA=11`,
  '-ar', '48000', '-ac', '2', join(dir, 'bgm.wav'),
]);
makeTacticalSfx(EP);
console.log(`wrote ${EP}/bgm.wav + impact riser tick`);
