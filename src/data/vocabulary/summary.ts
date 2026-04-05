export interface VocabUnitSummary {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly voiceIntro: string;
  readonly order: number;
  readonly characters: readonly string[];
}

export const vocabularyUnitSummaries: readonly VocabUnitSummary[] = [
  {
    id: 'unit-numbers-time',
    title: '時',
    icon: '🕐',
    voiceIntro: '我們來學數字和時間相關的字',
    order: 0,
    characters: ['一', '二', '三', '十', '百', '元', '月', '日', '今', '年'],
  },
  {
    id: 'unit-family',
    title: '家',
    icon: '🏡',
    voiceIntro: '我們來學家庭相關的字',
    order: 1,
    characters: ['家', '人', '大', '小', '好', '爸', '媽'],
  },
  {
    id: 'unit-food',
    title: '食物',
    icon: '🍚',
    voiceIntro: '我們來學吃東西相關的字',
    order: 2,
    characters: ['吃', '飯', '水', '茶', '肉', '菜', '魚', '蛋', '湯', '甜'],
  },
  {
    id: 'unit-animals',
    title: '動物',
    icon: '🐶',
    voiceIntro: '我們來學動物相關的字',
    order: 3,
    characters: ['狗', '貓', '豬', '牛', '羊', '雞', '鳥', '魚', '馬', '蟲'],
  },
  {
    id: 'unit-daily-items',
    title: '日常用品',
    icon: '🏪',
    voiceIntro: '我們來學日常用品相關的字',
    order: 4,
    characters: ['買', '賣', '開', '關', '電', '話', '紙', '衣', '錢', '門'],
  },
  {
    id: 'unit-transportation',
    title: '行',
    icon: '🚌',
    voiceIntro: '我們來學交通相關的字',
    order: 5,
    characters: ['車', '站', '路', '北', '南', '出', '入', '左', '右', '停'],
  },
  {
    id: 'unit-health',
    title: '身體健康',
    icon: '🏥',
    voiceIntro: '我們來學身體健康相關的字',
    order: 7,
    characters: ['醫', '院', '藥', '痛', '頭', '手', '眼', '牙', '熱', '冷'],
  },
  {
    id: 'unit-appliances',
    title: '電',
    icon: '📺',
    voiceIntro: '我們來學家用電器相關的字',
    order: 8,
    characters: ['視', '腦', '機', '洗', '冰', '箱', '燈', '扇', '冷', '爐'],
  },
  {
    id: 'unit-activities',
    title: '活',
    icon: '🏃',
    voiceIntro: '我們來學日常活動相關的字',
    order: 9,
    characters: ['走', '跑', '坐', '起', '睡', '喝', '說', '看', '聽', '穿'],
  },
  {
    id: 'unit-furniture',
    title: '住',
    icon: '🛋️',
    voiceIntro: '我們來學家具相關的字',
    order: 10,
    characters: ['櫃', '架', '沙', '窗', '簾', '鏡', '枕', '被', '墊', '浴'],
  },
] as const;

export function getVocabularyUnitSummary(unitId: string): VocabUnitSummary | null {
  return vocabularyUnitSummaries.find((unit) => unit.id === unitId) ?? null;
}
