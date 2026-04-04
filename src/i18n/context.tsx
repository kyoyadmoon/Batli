import { createContext, useContext, useCallback, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { HelperLangCode, HelperWord, HelperWordSet } from './types';
import { HELPER_LANGUAGES } from './types';

interface HelperLangState {
  lang: HelperLangCode;
  showPronunciation: boolean;
}

interface HelperLangContextValue extends HelperLangState {
  setHelperLang: (code: HelperLangCode) => void;
  setShowPronunciation: (show: boolean) => void;
  /** Look up the helper word for a Chinese character, compound word, or UI phrase */
  t: (chineseText: string) => HelperWord | undefined;
  /** Resolve system UI text for display; 台語 mode keeps UI in Chinese */
  uiText: (chineseText: string) => string;
  isHelperEnabled: boolean;
  availableLanguages: typeof HELPER_LANGUAGES;
}

const STORAGE_KEY = 'learnzhtw-helper-lang';

function detectDefaultHelperLang(): HelperLangCode {
  if (typeof navigator === 'undefined') return 'none';

  const locales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const normalizedLocales = locales
    .filter((locale): locale is string => Boolean(locale))
    .map((locale) => locale.toLowerCase());

  const isTraditionalChinese = normalizedLocales.some((locale) => (
    locale === 'zh-tw'
    || locale.startsWith('zh-tw-')
    || locale === 'zh-hk'
    || locale.startsWith('zh-hk-')
    || locale === 'zh-mo'
    || locale.startsWith('zh-mo-')
    || locale === 'zh-hant'
    || locale.startsWith('zh-hant-')
  ));

  return isTraditionalChinese ? 'tai' : 'none';
}

function loadState(): HelperLangState {
  const defaultLang = detectDefaultHelperLang();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { lang: defaultLang, showPronunciation: false };
    const parsed = JSON.parse(stored);
    const lang = HELPER_LANGUAGES.some((item) => item.code === parsed.lang)
      ? parsed.lang
      : defaultLang;

    return {
      lang,
      showPronunciation: parsed.showPronunciation ?? false,
    };
  } catch {
    return { lang: defaultLang, showPronunciation: false };
  }
}

function saveState(state: HelperLangState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Lazy-load locale data to avoid bundling all languages upfront
async function loadLocale(code: HelperLangCode): Promise<HelperWordSet | null> {
  switch (code) {
    case 'zh':
      return (await import('./locales/zh')).zh;
    case 'en':
      return (await import('./locales/en')).en;
    case 'tai':
      return (await import('./locales/tai')).tai;
    default:
      return null;
  }
}

const HelperLangContext = createContext<HelperLangContextValue | null>(null);

export function HelperLanguageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HelperLangState>(loadState);
  const [localeData, setLocaleData] = useState<HelperWordSet | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Load locale data when language changes
  useEffect(() => {
    if (state.lang === 'none') {
      setLocaleData(null);
      return;
    }
    let cancelled = false;
    loadLocale(state.lang).then((data) => {
      if (!cancelled) setLocaleData(data);
    });
    return () => { cancelled = true; };
  }, [state.lang]);

  const setHelperLang = useCallback((code: HelperLangCode) => {
    setState((prev) => ({ ...prev, lang: code }));
  }, []);

  const setShowPronunciation = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showPronunciation: show }));
  }, []);

  const t = useCallback(
    (chineseText: string): HelperWord | undefined => {
      if (!localeData) return undefined;
      return localeData.characters[chineseText]
        ?? localeData.words[chineseText]
        ?? localeData.ui[chineseText];
    },
    [localeData],
  );

  const uiText = useCallback(
    (chineseText: string): string => {
      if (state.lang === 'none' || state.lang === 'tai') return chineseText;
      return localeData?.ui[chineseText]?.translation ?? chineseText;
    },
    [localeData, state.lang],
  );

  const value = useMemo<HelperLangContextValue>(
    () => ({
      ...state,
      setHelperLang,
      setShowPronunciation,
      t,
      uiText,
      isHelperEnabled: state.lang !== 'none',
      availableLanguages: HELPER_LANGUAGES,
    }),
    [state, setHelperLang, setShowPronunciation, t, uiText],
  );

  return (
    <HelperLangContext.Provider value={value}>
      {children}
    </HelperLangContext.Provider>
  );
}

export function useHelperLang(): HelperLangContextValue {
  const ctx = useContext(HelperLangContext);
  if (!ctx) throw new Error('useHelperLang must be used within HelperLanguageProvider');
  return ctx;
}
