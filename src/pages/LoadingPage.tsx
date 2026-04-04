import styles from './LoadingPage.module.css';

export function LoadingPage() {
  return (
    <div className={styles.container}>
      <main className={styles.panel} aria-live="polite" aria-busy="true">
        <div className={styles.spinner} aria-hidden="true" />
        <h1 className={styles.title}>載入中</h1>
        <p className={styles.description}>正在準備學習內容。</p>
      </main>
    </div>
  );
}
