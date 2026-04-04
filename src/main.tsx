import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { getCompatibilityReport } from './compatibility/report';
import { CompatibilityPage } from './pages/CompatibilityPage';
import { LoadingPage } from './pages/LoadingPage';
import { createAppRouter } from './router';
import './styles/global.css';

function AppBootstrap() {
  const [report, setReport] = useState<Awaited<ReturnType<typeof getCompatibilityReport>> | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getCompatibilityReport().then((nextReport) => {
      if (!cancelled) {
        setReport(nextReport);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const router = useMemo(
    () => (report?.compatible ? createAppRouter() : null),
    [report?.compatible],
  );

  if (!report) {
    return <LoadingPage />;
  }

  if (!router) {
    return <CompatibilityPage report={report} />;
  }

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
);
