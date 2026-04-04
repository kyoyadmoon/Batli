import { Outlet } from 'react-router-dom';
import { LearningProvider } from '@/context/LearningContext';
import { TopicMenuProvider } from '@/context/TopicMenuContext';
import { HelperLanguageProvider } from '@/i18n';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import styles from './App.module.css';

export function App() {
  return (
    <HelperLanguageProvider>
    <LearningProvider>
      <TopicMenuProvider>
        <div className={styles.shell}>
          <AppHeader />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </TopicMenuProvider>
    </LearningProvider>
    </HelperLanguageProvider>
  );
}
