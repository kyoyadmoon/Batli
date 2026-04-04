// ============================================
// Curriculum type system
// ============================================

/** Identifies the kind of module for discriminated unions */
export type ModuleKind = 'zhuyin' | 'vocabulary';

/** A reference to an image — local asset path or external URL */
export type ImageRef = string;

/** Text that will be passed to Web Speech API (zh-TW) */
export type TTSText = string;

/** Grouping for the 37 zhuyin symbols */
export type ZhuyinGroup = '聲母' | '韻母' | '介音';

// ---- Zhuyin Module ----

export interface ZhuyinSymbol {
  readonly symbol: string;
  readonly group: ZhuyinGroup;
  readonly order: number;
  readonly pronunciation: TTSText;
  readonly imageRef?: ImageRef;
}

export interface ZhuyinModule {
  readonly kind: 'zhuyin';
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly voiceIntro: TTSText;
  readonly symbols: readonly ZhuyinSymbol[];
}

// ---- Vocabulary Module ----

export interface VocabCharacter {
  readonly character: string;
  readonly zhuyin: string;
  readonly pronunciation: TTSText;
  readonly imageRef: ImageRef;
  readonly order: number;
  readonly hidePrimaryHelper?: boolean;
  readonly contextWord?: string;
  readonly contextPronunciation?: TTSText;
  readonly relatedWords?: readonly VocabRelatedWord[];
}

export interface VocabRelatedWord {
  readonly word: string;
  readonly pronunciation?: TTSText;
  readonly emoji: string;
}

export interface VocabUnit {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly voiceIntro: TTSText;
  readonly order: number;
  readonly characters: readonly VocabCharacter[];
}

export interface VocabularyModule {
  readonly kind: 'vocabulary';
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly voiceIntro: TTSText;
  readonly units: readonly VocabUnit[];
}

// ---- Curriculum root ----

export type CurriculumModule = ZhuyinModule | VocabularyModule;

export interface Curriculum {
  readonly version: string;
  readonly modules: readonly CurriculumModule[];
}

// ---- Quiz support ----

export interface QuizQuestion<T> {
  readonly prompt: TTSText;
  readonly correctAnswer: T;
  readonly distractors: readonly T[];
}
