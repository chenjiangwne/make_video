import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {CUES, DURATION, FPS, KEYWORD, SFX, SHOTS, TITLE, cueStart} from '../../src/episodes/ep54-national-debt-story/timeline';

describe('ep54 国家债务爆雷（180s）', () => {
  it('片长 180 秒，八个镜头首尾相接', () => {
    expect(DURATION).toBe(180 * FPS);
    const list = Object.values(SHOTS);
    expect(list.length).toBe(8);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
  });

  it('字幕递增、在片长内、中文 ≤18 字、都有英文', () => {
    expect(CUES.length).toBe(59);
    for (let i = 1; i < CUES.length; i++) expect(CUES[i][0]).toBeGreaterThan(CUES[i - 1][0]);
    CUES.forEach(([, cn, en], i) => {
      expect(cueStart(i)).toBeLessThan(DURATION);
      expect(cn.replace(/[【】〔〕〖〗\s，。：；？、——「」“”·]/g, '').length).toBeLessThanOrEqual(18);
      expect(en.length).toBeGreaterThan(5);
    });
  });

  it('结构：钩子 / 内债外债 / 三种情景 / 普通人 / 总结', () => {
    const all = CUES.map(([, cn]) => cn).join('');
    ['存款', '工资', '内债', '外债', '外币', '通胀', '违约', '外汇', '贬值', '失控'].forEach((k) => expect(all).toContain(k));
    expect(TITLE).toContain('债务');
    expect(KEYWORD).toBe('内债 ≠ 外债');
  });

  it('音效都在片长内，文件存在（本地已生成音频时）', () => {
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep54-national-debt-story/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
