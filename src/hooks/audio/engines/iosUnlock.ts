import { speechEngine } from './speechEngine';
import { toneEngine } from './toneEngine';

interface IOSUnlockState {
  bound: boolean;
  win?: Window & typeof globalThis;
  resumeSpeech: () => void;
  ensureToneRunning: () => Promise<unknown>;
  canUnlock: () => boolean;
}

interface BindIOSUnlockOptions {
  win?: Window & typeof globalThis;
  resumeSpeech?: () => void;
  ensureToneRunning?: () => Promise<unknown>;
  canUnlock?: () => boolean;
}

const IOS_UNLOCK_STATE_KEY = '__learnzhtw_ios_unlock_state__';

function getIOSUnlockState(): IOSUnlockState {
  const root = globalThis as typeof globalThis & {
    [IOS_UNLOCK_STATE_KEY]?: IOSUnlockState;
  };

  if (!root[IOS_UNLOCK_STATE_KEY]) {
    root[IOS_UNLOCK_STATE_KEY] = {
      bound: false,
      resumeSpeech: () => {},
      ensureToneRunning: async () => undefined,
      canUnlock: () => false,
    };
  }

  return root[IOS_UNLOCK_STATE_KEY];
}

export function bindIOSUnlockListeners(options: BindIOSUnlockOptions = {}) {
  const state = getIOSUnlockState();
  state.resumeSpeech = options.resumeSpeech ?? speechEngine.resume;
  state.ensureToneRunning = options.ensureToneRunning ?? toneEngine.ensureRunning;
  state.canUnlock = options.canUnlock ?? (() => speechEngine.isSupported() || toneEngine.isSupported());

  const win = options.win ?? (typeof window !== 'undefined' ? window : undefined);
  if (!win || state.bound || !state.canUnlock()) {
    return;
  }

  const unlock = () => {
    try {
      state.resumeSpeech();
    } catch {
      // Speech recovery is best-effort.
    }

    void state.ensureToneRunning();
  };

  win.addEventListener('pointerdown', unlock, true);
  win.addEventListener('keydown', unlock, true);
  state.bound = true;
  state.win = win;
}
