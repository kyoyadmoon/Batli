import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface TopicMenuContextValue {
  readonly isTopicMenuOpen: boolean;
  openTopicMenu: () => void;
  closeTopicMenu: () => void;
  toggleTopicMenu: () => void;
}

const TopicMenuContext = createContext<TopicMenuContextValue | null>(null);

export function TopicMenuProvider({ children }: { children: ReactNode }) {
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);

  const openTopicMenu = useCallback(() => {
    setIsTopicMenuOpen(true);
  }, []);

  const closeTopicMenu = useCallback(() => {
    setIsTopicMenuOpen(false);
  }, []);

  const toggleTopicMenu = useCallback(() => {
    setIsTopicMenuOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isTopicMenuOpen,
      openTopicMenu,
      closeTopicMenu,
      toggleTopicMenu,
    }),
    [isTopicMenuOpen, openTopicMenu, closeTopicMenu, toggleTopicMenu],
  );

  return <TopicMenuContext.Provider value={value}>{children}</TopicMenuContext.Provider>;
}

export function useTopicMenu(): TopicMenuContextValue {
  const ctx = useContext(TopicMenuContext);
  if (!ctx) throw new Error('useTopicMenu must be used within TopicMenuProvider');
  return ctx;
}
