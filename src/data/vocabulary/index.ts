import type { VocabularyModule } from '../types';
import { numbersTimeUnit } from './numbers-time';
import { familyUnit } from './family';
import { commonWords1Unit } from './common-words-1';
import { commonWords2Unit } from './common-words-2';
import { foodUnit } from './food';
import { animalsUnit } from './animals';
import { dailyItemsUnit } from './daily-items';
import { transportationUnit } from './transportation';
import { healthUnit } from './health';
import { appliancesUnit } from './appliances';
import { activitiesUnit } from './activities';
import { furnitureUnit } from './furniture';

export const vocabularyModule: VocabularyModule = {
  kind: 'vocabulary',
  id: 'core-literacy',
  title: '核心識字',
  icon: '📖',
  voiceIntro: '歡迎來到識字學習',
  units: [
    numbersTimeUnit,
    familyUnit,
    commonWords1Unit,
    commonWords2Unit,
    foodUnit,
    animalsUnit,
    dailyItemsUnit,
    transportationUnit,
    healthUnit,
    appliancesUnit,
    activitiesUnit,
    furnitureUnit,
  ],
} as const;
