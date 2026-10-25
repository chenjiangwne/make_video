import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {CUES, DURATION, FPS, HOT_ANGLES, SHOTS, TITLE} from '../../src/episodes/import-demo-noaudio/timeline';

describe('import-demo-noaudio 无音轨示例', () => {
  it('12 秒，三镜首尾相接', () => {
    expect(DURATION / FPS).toBe(12);
    const list = Object.values(SHOTS);
    expect(list[0][0]).toBe(0);
    for (let i = 1; i < list.length; i++) expect(list[i][0]).toBe(list[i - 1][1]);
    expect(list[list.length - 1][1]).toBe(DURATION);
    expect(SHOTS.title[1] - SHOTS.title[0]).toBe(3 * FPS);
    expect(SHOTS.milk[1] - SHOTS.milk[0]).toBe(5 * FPS);
    expect(SHOTS.orbit[1] - SHOTS.orbit[0]).toBe(4 * FPS);
  });

  it('字幕从镜头起点开始，字数 ≤18', () => {
    expect(CUES[0][0]).toBe(SHOTS.milk[0]);
    expect(CUES[1][0]).toBe(SHOTS.orbit[0]);
    CUES.forEach(([, cn]) => {
      expect(cn.replace(/[，。：；？、\s]/g, '').length).toBeLessThanOrEqual(18);
    });
    expect(TITLE).toBe('看不见的靶心');
    expect(HOT_ANGLES.length).toBe(8);
  });

  it('组件里没有任何 Audio（交付必须无音频流）', () => {
    const src = readFileSync('src/episodes/import-demo-noaudio/ImportDemo.tsx', 'utf8');
    expect(src.includes('<Audio')).toBe(false);
    expect(src.includes('SFX')).toBe(false);
  });
});
