export interface Poem {
  id: number;
  title: string;
  author: string;
  lines: string[];
  tags: string[];
}

export type ThemeId = 'light' | 'dark';

export interface Theme {
  id: ThemeId;
  name: string;
  isDark: boolean;
}

export interface UserAction {
  poemId: number;
  action: 'like' | 'dislike';
  timestamp: number;
}

export interface DailyStat {
  day: string;
  count: number;
  isTarget?: boolean;
}
