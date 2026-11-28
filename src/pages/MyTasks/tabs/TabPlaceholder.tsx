import styles from './TabPlaceholder.module.css';

/** 시안이 아직 없는 탭 자리 */
export function TabPlaceholder({ title }: { title: string }) {
  return (
    <div className={styles.placeholder}>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>화면을 준비하고 있어요.</p>
    </div>
  );
}
