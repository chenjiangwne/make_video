import {existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  BUDGET,
  CASES,
  CUES,
  DARK_FROM,
  DARK_FROM2,
  DURATION,
  FPS,
  HIT,
  HIT2,
  QUOTE_1,
  QUOTE_2,
  SFX,
  SHOTS,
  TITLE,
  cueStart,
  fbt,
} from '../../src/episodes/ep53-national-debt/timeline';

describe('ep53 国债的账单', () => {
  it('卡点：16 秒标题、144 秒锚词，片长 180 秒（±1 秒）', () => {
    expect(Math.abs(HIT - 16 * FPS)).toBeLessThanOrEqual(1);
    expect(Math.abs(HIT2 - 144 * FPS)).toBeLessThanOrEqual(1);
    expect(DURATION / FPS).toBeGreaterThan(179);
    expect(DURATION / FPS).toBeLessThan(181);
    expect(DARK_FROM).toBeLessThan(HIT - 10);
    expect(DARK_FROM2).toBeLessThan(HIT2 - 10);
  });

  it('镜头首尾相接，爆点 / 大字卡是镜头起点', () => {
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[0]).toBe(HIT);
    expect(SHOTS.hit2[0]).toBe(HIT2);
    expect(SHOTS.quote[0]).toBe(fbt(328));
    expect(SHOTS.end[0]).toBe(fbt(352));
  });

  it('字幕：递增、在片长内、中文 ≤18 字、都有英文；爆点留空；锚词开头结尾都出现', () => {
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
    expect(CUES.find(([b]) => b === 328)![1]).toBeNull();
    const texts = CUES.map(([, cn]) => cn ?? '');
    expect(texts.slice(0, 5).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts.slice(-5).some((t) => t.includes(ANCHOR))).toBe(true);
    expect(texts[texts.length - 1]).toContain('购买力');
  });

  it('选题核心：本币 / 外币、银行—主权循环、存款购买力都写进片子', () => {
    const all = CUES.map(([, cn]) => cn ?? '').join('');
    ['存款', '利息', '银行', '挤兑', '通胀', '购买力', '本币', '外币', '违约'].forEach((k) => expect(all).toContain(k));
    expect(all).toContain('主权—银行循环');
    expect(QUOTE_1).toBe('你的存款没有消失，');
    expect(QUOTE_2).toBe('只是被重新定价了。');
    expect(QUOTE_2).toContain('重新定价');
    expect(TITLE).toBe('国债的账单');
  });

  it('事实常量：预算比例合计 100（示意），历史案例年份正确', () => {
    expect(BUDGET.interest + BUDGET.education + BUDGET.health + BUDGET.other).toBe(100);
    expect(BUDGET.note).toBe('示意');
    expect(CASES.map((c) => c.year)).toEqual([2001, 2019, 2022]);
    expect(CASES.map((c) => c.country)).toEqual(['阿根廷', '黎巴嫩', '斯里兰卡']);
  });

  it('音效都在片长内，两个爆点有 impact，转场有 riser；文件存在（本地已生成音频时）', () => {
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT)).toBe(true);
    expect(SFX.some(([file, at]) => file.endsWith('impact.wav') && at === HIT2)).toBe(true);
    expect(SFX.some(([file]) => file.endsWith('riser.wav'))).toBe(true);
    for (const [file, at] of SFX) {
      expect(at).toBeGreaterThanOrEqual(0);
      expect(at).toBeLessThan(DURATION);
      if (existsSync('public/audio/ep53-national-debt/bgm.wav')) expect(existsSync(`public/${file}`)).toBe(true);
    }
  });
});
