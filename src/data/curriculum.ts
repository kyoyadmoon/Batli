import type { Curriculum } from './types';
import { zhuyinModule } from './zhuyin';
import { vocabularyModule } from './vocabulary';

export const curriculum: Curriculum = {
  version: '1.0.0',
  modules: [zhuyinModule, vocabularyModule],
} as const;
