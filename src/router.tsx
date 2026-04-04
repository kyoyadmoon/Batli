import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';

const ModuleSelectPage = lazy(() => import('./pages/ModuleSelectPage').then(m => ({ default: m.ModuleSelectPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ZhuyinLearnPage = lazy(() => import('./pages/zhuyin/ZhuyinLearnPage').then(m => ({ default: m.ZhuyinLearnPage })));
const ZhuyinQuizPage = lazy(() => import('./pages/zhuyin/ZhuyinQuizPage').then(m => ({ default: m.ZhuyinQuizPage })));
const RecognitionPage = lazy(() => import('./pages/vocab/RecognitionPage').then(m => ({ default: m.RecognitionPage })));
const ListeningPage = lazy(() => import('./pages/vocab/ListeningPage').then(m => ({ default: m.ListeningPage })));
const WritingPage = lazy(() => import('./pages/vocab/WritingPage').then(m => ({ default: m.WritingPage })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'settings', element: <Lazy><SettingsPage /></Lazy> },
        { path: 'select', element: <Lazy><ModuleSelectPage /></Lazy> },
        { path: 'zhuyin/learn/:index', element: <Lazy><ZhuyinLearnPage /></Lazy> },
        { path: 'zhuyin/quiz', element: <Lazy><ZhuyinQuizPage /></Lazy> },
        { path: 'vocab/:unitId/recognition/:index', element: <Lazy><RecognitionPage /></Lazy> },
        { path: 'vocab/:unitId/listening/:index', element: <Lazy><ListeningPage /></Lazy> },
        { path: 'vocab/:unitId/writing/:index', element: <Lazy><WritingPage /></Lazy> },
      ],
    },
  ], { basename: import.meta.env.BASE_URL });
}
