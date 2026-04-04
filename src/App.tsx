import { Link, Outlet } from 'react-router-dom';
import { LearningProvider } from '@/context/LearningContext';
import { TopicMenuProvider } from '@/context/TopicMenuContext';
import { HelperLanguageProvider, useHelperLang } from '@/i18n';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import styles from './App.module.css';

function AppShell() {
  const { uiText } = useHelperLang();

  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <Link
          className={styles.footerLink}
          to="/settings#licenses"
        >
          {uiText('授權資訊')}
        </Link>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <HelperLanguageProvider>
      <LearningProvider>
        <TopicMenuProvider>
          <AppShell />
        </TopicMenuProvider>
      </LearningProvider>
    </HelperLanguageProvider>
  );
}
