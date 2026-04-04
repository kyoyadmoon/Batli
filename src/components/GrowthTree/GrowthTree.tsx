import styles from './GrowthTree.module.css';

interface GrowthTreeProps {
  /** Number of lessons completed (determines tree growth) */
  completed: number;
}

/** Stages: seed (0), sprout (1-3), small tree (4-10), big tree (11+) */
function getStage(completed: number): { emoji: string; label: string } {
  if (completed === 0) return { emoji: '🌱', label: '種子' };
  if (completed <= 3) return { emoji: '🌿', label: '小芽' };
  if (completed <= 10) return { emoji: '🌳', label: '小樹' };
  return { emoji: '🌲', label: '大樹' };
}

export function GrowthTree({ completed }: GrowthTreeProps) {
  const { emoji, label } = getStage(completed);

  return (
    <div className={styles.container} aria-label={`學習進度：${label}`}>
      <div className={styles.tree}>{emoji}</div>
      <div className={styles.copy}>
        <div className={styles.label}>{label}</div>
        <div className={styles.progress}>已完成 {completed} 個學習項目</div>
      </div>
      <div className={styles.ground} />
    </div>
  );
}
