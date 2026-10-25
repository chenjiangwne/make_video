export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 360; // 12s：S01 3s + S02 5s + S03 4s

export const TITLE = '看不见的靶心';

/** 镜头首尾相接 */
export const SHOTS = {
  title: [0, 90],
  milk: [90, 240],
  orbit: [240, 360],
} as const;

/** 屏幕字幕：无音轨，所以字幕就是唯一叙述 */
export const CUES: [number, string, number?][] = [
  [90, '同一杯牛奶，左边烫，右边温', 228],
  [240, '它不是加热均匀，是轮流挨烫'],
];

/** 靶心热点角度（与画面一致） */
export const HOT_ANGLES = [18, 70, 122, 168, 214, 262, 308, 350];
