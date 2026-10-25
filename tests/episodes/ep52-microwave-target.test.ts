import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  CUES,
  DARK_FROM,
  DARK_FROM2,
  DEMO_TEMP,
  DURATION,
  FPS,
  HALF_BEATS,
  HIT,
  HIT2,
  HOT_ANGLES,
  MICROWAVE,
  QUOTE_1,
  QUOTE_2,
  SFX,
  SHOTS,
  cueStart,
  fbt,
} from '../../src/episodes/ep52-microwave-target/timeline';

describe('ep52 看不见的靶心', () => {
  it('卡点：16 秒标题、96 秒锚词都落在 120 BPM 的小节线上（±1 帧）', () => {
    expect(Math.abs(HIT - 16 * FPS)).toBeLessThanOrEqual(1);
    expect(Math.abs(HIT2 - 96 * FPS)).toBeLessThanOrEqual(1);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
    expect(HOT_ANGLES.length).toBe(8);
  });

  it('片长 120 秒（±1 秒），镜头首尾相接，两个爆点是镜头起点', () => {
    expect(DURATION / FPS).toBeGreaterThan(119);
    expect(DURATION / FPS).toBeLessThan(121);
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.quote[0]).toBe(fbt(208));
  });

  it('字幕：按拍递增、都在片长内、中文 ≤18 字、都有英文；爆点留空；锚词开头结尾都出现', () => {
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, cn, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION - FPS);
      if (cn) {
        expect(cn.replace(/[【】〔〕〖〗\s，。：；？、——「」“”·]/g, '').length).toBeLessThanOrEqual(18);
        expect(en.length).toBeGreaterThan(5);
      }
    });
    expect(CUES.find(([b]) => fbt(b) === HIT)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === HIT2)![1]).toBeNull();
    expect(CUES.find(([b]) => fbt(b) === fbt(208))![1]).toBeNull();
    HALF_BEATS.forEach((b) => expect(CUES.find(([beat]) => beat === b)![1]).toMatch(/——$/));
    const texts = CUES.map(([, cn]) => cn ?? '');
    expect(texts.slice(0, 4).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts.slice(-4).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts[texts.length - 1]).toContain('靶心');
  });

  it('用户大纲的五句话都在片子里', () => {
    const all = CUES.map(([, cn]) => cn ?? '').join('');
    expect(CUES[0][1]).toContain('同一杯牛奶');
    expect(CUES[0][1]).toContain('烫嘴');
    expect(CUES[0][1]).toContain('温吞');
    expect(all).toContain('微波炉');
    expect(all).toContain('取下转盘放正中');
    expect(all).toContain(QUOTE_1);
    expect(all).toContain('轮流去挨烫');
    expect(all).toContain('下次它转');
    expect(all).toContain('默默谢它一句');
    expect(QUOTE_2.replace(/[〔〕]/g, '')).toBe('是让食物轮流去挨烫。');
  });

  it('事实：2.45 GHz 的波长约 12.2 cm，半波长约 6.1 cm；温度只作示意', () => {
    expect(Math.abs(MICROWAVE.wavelengthCm - 29.9792458 / MICROWAVE.freqGHz)).toBeLessThan(0.06);
    expect(Math.abs(MICROWAVE.halfWaveCm - MICROWAVE.wavelengthCm / 2)).toBeLessThan(0.02);
    expect(DEMO_TEMP.note).toBe('示意');
    expect(DEMO_TEMP.rimC).toBeGreaterThan(DEMO_TEMP.centerC);
    expect(DEMO_TEMP.minutes).toBe(10);
  });

  it('音效都在片长内，两个爆点有 impact，转盘有电机声；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('motor.wav') && at === fbt(96))).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep52-microwave-target/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
