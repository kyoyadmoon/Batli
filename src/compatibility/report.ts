export type CompatibilityIssueId =
  | 'storage'
  | 'history'
  | 'animation'
  | 'fetch'
  | 'speech'
  | 'svg';

export interface CompatibilityIssue {
  id: CompatibilityIssueId;
  title: string;
  detail: string;
  blocking?: boolean;
}

export interface CompatibilityReport {
  compatible: boolean;
  issues: CompatibilityIssue[];
}

interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

interface HistoryLike {
  pushState?: History['pushState'];
  replaceState?: History['replaceState'];
}

interface SpeechSynthesisLike {
  speak?: SpeechSynthesis['speak'];
  cancel?: SpeechSynthesis['cancel'];
  resume?: SpeechSynthesis['resume'];
  getVoices?: SpeechSynthesis['getVoices'];
}

interface DocumentLike {
  createElementNS?: Document['createElementNS'];
}

export interface CompatibilityEnvironment {
  localStorage?: StorageLike;
  history?: HistoryLike;
  requestAnimationFrame?: typeof window.requestAnimationFrame;
  fetch?: typeof window.fetch;
  speechSynthesis?: SpeechSynthesisLike;
  document?: DocumentLike;
}

function isStorageAvailable(storage?: StorageLike): boolean {
  if (!storage) return false;

  try {
    const key = '__learnzhtw-compatibility-check__';
    storage.setItem(key, '1');
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function hasHistorySupport(history?: HistoryLike): boolean {
  return typeof history?.pushState === 'function' && typeof history.replaceState === 'function';
}

function hasSpeechSupport(speechSynthesis?: SpeechSynthesisLike): boolean {
  return (
    typeof speechSynthesis?.speak === 'function'
    && typeof speechSynthesis.cancel === 'function'
    && typeof speechSynthesis.resume === 'function'
    && typeof speechSynthesis.getVoices === 'function'
  );
}

function hasSvgSupport(doc?: DocumentLike): boolean {
  return typeof doc?.createElementNS === 'function';
}

export async function assessCompatibility(env: CompatibilityEnvironment): Promise<CompatibilityReport> {
  const issues: CompatibilityIssue[] = [];

  if (!isStorageAvailable(env.localStorage)) {
    issues.push({
      id: 'storage',
      title: '無法儲存學習進度',
      detail: '這個裝置的瀏覽器無法正常使用 localStorage。',
      blocking: true,
    });
  }

  if (!hasHistorySupport(env.history)) {
    issues.push({
      id: 'history',
      title: '無法切換學習頁面',
      detail: '這個裝置的瀏覽器不支援必要的 History API。',
      blocking: true,
    });
  }

  if (typeof env.requestAnimationFrame !== 'function') {
    issues.push({
      id: 'animation',
      title: '無法顯示必要動畫',
      detail: '長按儲存、答題回饋與部分互動需要 requestAnimationFrame。',
      blocking: true,
    });
  }

  if (typeof env.fetch !== 'function') {
    issues.push({
      id: 'fetch',
      title: '無法載入學習資料',
      detail: '筆順與字形資料需要透過 fetch 下載。',
      blocking: true,
    });
  }

  if (!hasSpeechSupport(env.speechSynthesis)) {
    issues.push({
      id: 'speech',
      title: '無法播放語音',
      detail: '這個學習流程依賴瀏覽器語音播放功能。',
      blocking: true,
    });
  }

  if (!hasSvgSupport(env.document)) {
    issues.push({
      id: 'svg',
      title: '無法顯示筆順練習',
      detail: '書寫與筆順功能需要 SVG 繪圖支援。',
      blocking: true,
    });
  }

  return {
    compatible: issues.every((issue) => issue.blocking !== true),
    issues,
  };
}

export async function getCompatibilityReport(): Promise<CompatibilityReport> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      compatible: false,
      issues: [
        {
          id: 'history',
          title: '無法啟動學習介面',
          detail: '目前執行環境不是可用的瀏覽器。',
          blocking: true,
        },
      ],
    };
  }

  let storage: StorageLike | undefined;
  try {
    storage = window.localStorage;
  } catch {
    // Privacy-restricted browsers (LINE, Facebook webview) can throw
    // just from reading window.localStorage.
  }

  return assessCompatibility({
    localStorage: storage,
    history: window.history,
    requestAnimationFrame: window.requestAnimationFrame,
    fetch: window.fetch,
    speechSynthesis: 'speechSynthesis' in window ? window.speechSynthesis : undefined,
    document,
  });
}
