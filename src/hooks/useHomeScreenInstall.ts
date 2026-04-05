import { useCallback, useEffect, useMemo, useState } from 'react';

export type HomeScreenInstallStatus =
  | 'hidden'
  | 'prompt'
  | 'manual-ios'
  | 'manual-android'
  | 'installed';

type InstallRequestResult =
  | 'prompted'
  | 'accepted'
  | 'dismissed'
  | 'manual-ios'
  | 'manual-android'
  | 'installed'
  | 'unsupported';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

function isStandaloneMode(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosSafari(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const isWebKit = /webkit/.test(userAgent);
  const isOtherIosBrowser = /crios|fxios|edgios/.test(userAgent);
  return isIos && isWebKit && !isOtherIosBrowser;
}

function isAndroidBrowser(): boolean {
  return /android/i.test(window.navigator.userAgent);
}

function isProbablyMobileDevice(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|mobile/.test(userAgent)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
}

export function useHomeScreenInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const status = useMemo<HomeScreenInstallStatus>(() => {
    if (isInstalled) return 'installed';
    if (!isProbablyMobileDevice()) return 'hidden';
    if (deferredPrompt) return 'prompt';
    if (isIosSafari()) return 'manual-ios';
    if (isAndroidBrowser()) return 'manual-android';
    return 'hidden';
  }, [deferredPrompt, isInstalled]);

  const requestInstall = useCallback(async (): Promise<InstallRequestResult> => {
    if (isInstalled) {
      return 'installed';
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        return 'accepted';
      }

      return 'dismissed';
    }

    if (isIosSafari()) {
      return 'manual-ios';
    }

    if (isAndroidBrowser()) {
      return 'manual-android';
    }

    return 'unsupported';
  }, [deferredPrompt, isInstalled]);

  return { status, requestInstall };
}
