// ============================================
// Helper Language (輔助字詞) type system
// ============================================

/** Supported helper language codes */
export type HelperLangCode = 'none' | 'zh' | 'en' | 'tai';

/** Metadata for a helper language option */
export interface HelperLangInfo {
  readonly code: HelperLangCode;
  /** Display name in the language itself */
  readonly nativeName: string;
  /** Display name in Chinese */
  readonly zhName: string;
  /** Whether this language has pronunciation text data (e.g. Tai-lo); this does not imply audio playback support. */
  readonly hasPronunciation: boolean;
}

/** 輔助字詞：a learning word's translation/definition in the helper language */
export interface HelperWord {
  /** The translated or defined text (e.g. "home", "厝", "家庭、住所") */
  readonly translation: string;
  /** Romanization for TTS (e.g. Tai-lo "tshù"), only for languages that need it */
  readonly pronunciation?: string;
}

/** A complete set of helper words for one language */
export interface HelperWordSet {
  /** Single-character translations: '家' → { translation: 'home' } */
  readonly characters: Record<string, HelperWord>;
  /** Compound-word translations: '家人' → { translation: 'family members' } */
  readonly words: Record<string, HelperWord>;
  /** System UI labels: '下一步' → { translation: 'next step' } */
  readonly ui: Record<string, HelperWord>;
}

/** All available helper languages */
export const HELPER_LANGUAGES: readonly HelperLangInfo[] = [
  { code: 'none', nativeName: '不顯示', zhName: '不顯示', hasPronunciation: false },
  { code: 'zh', nativeName: '中文釋義', zhName: '中文釋義', hasPronunciation: false },
  { code: 'en', nativeName: 'English', zhName: '英文', hasPronunciation: false },
  { code: 'tai', nativeName: '台語', zhName: '台語', hasPronunciation: true },
];
