import type { CompatibilityReport } from '@/compatibility/report';
import styles from './CompatibilityPage.module.css';

interface CompatibilityPageProps {
  report?: CompatibilityReport;
  checking?: boolean;
}

const RECOMMENDED_BROWSERS = [
  'iPhone / iPad：請改用最新版 Safari 開啟。',
  'Android：請改用最新版 Chrome 開啟。',
  'Windows：請改用最新版 Edge 或 Chrome 開啟。',
  'Mac：請改用最新版 Safari 或 Chrome 開啟。',
];

const NEXT_STEPS = [
  '先更新裝置系統與瀏覽器版本，再重新開啟這個網站。',
  '如果你是從 LINE、Facebook 或 Messenger 內建瀏覽器開啟，請改用 Safari、Chrome 或 Edge。',
  '如果更新後仍無法使用，請改用較新的手機、平板或電腦。',
];

export function CompatibilityPage({ report, checking = false }: CompatibilityPageProps) {
  return (
    <div className={styles.container}>
      <main className={styles.panel}>
        <div className={styles.hero}>
          <span className={styles.emoji} aria-hidden="true">⚠️</span>
          <h1 className={styles.title}>{checking ? '正在檢查裝置相容性' : '這台裝置目前不相容'}</h1>
          <p className={styles.description}>
            {checking
              ? '系統正在檢查瀏覽器功能與語音播放能力。'
              : '這個學習網站需要較新的瀏覽器功能。系統已偵測到目前裝置缺少以下能力，因此先停止進入學習流程，避免畫面出錯或無法播放語音。'}
          </p>
        </div>

        {!checking && report && (
          <section className={styles.section} aria-labelledby="compatibility-issues-title">
            <h2 id="compatibility-issues-title" className={styles.sectionTitle}>未通過的檢查項目</h2>
            <ul className={styles.issueList}>
              {report.issues.map((issue) => (
                <li key={issue.id} className={styles.issueItem}>
                  <strong className={styles.issueTitle}>{issue.title}</strong>
                  <p className={styles.issueDetail}>{issue.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section} aria-labelledby="compatibility-guidance-title">
          <h2 id="compatibility-guidance-title" className={styles.sectionTitle}>建議處理方式</h2>
          <ul className={styles.guidanceList}>
            {NEXT_STEPS.map((item) => (
              <li key={item} className={styles.guidanceItem}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="compatibility-browsers-title">
          <h2 id="compatibility-browsers-title" className={styles.sectionTitle}>建議使用的瀏覽器</h2>
          <ul className={styles.guidanceList}>
            {RECOMMENDED_BROWSERS.map((item) => (
              <li key={item} className={styles.guidanceItem}>{item}</li>
            ))}
          </ul>
        </section>

        {!checking && (
          <button
            type="button"
            className={styles.reloadButton}
            onClick={() => window.location.reload()}
          >
            重新檢查裝置
          </button>
        )}
      </main>
    </div>
  );
}
