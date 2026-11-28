import type { HTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Badge.module.css';

export const BADGE_TYPES = [
  'neutral-solid',
  'neutral-weak',
  'brand-weak',
  'critical-weak',
  'warning-weak',
  'critical-solid',
  'critical-ghost',
  'neutral-ghost',
  'ai',
  'team1',
  'team2',
  'team3',
] as const;
export const BADGE_SIZES = ['small', 'medium', 'large'] as const;
export const BADGE_SHAPES = ['square', 'pill'] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgeShape = (typeof BADGE_SHAPES)[number];

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** Figma `type`. 색 조합 (기본 neutral-solid). team1~3은 팀 구분용 색 */
  type?: BadgeType;
  /** Figma `size` (기본 small) */
  size?: BadgeSize;
  /** Figma `shape`. square는 모서리 4px, pill은 완전히 둥근 모양 (기본 square) */
  shape?: BadgeShape;
  /** 라벨 */
  children: ReactNode;
};

/**
 * Figma `Badge` 컴포넌트 (node 817:15858).
 * 상태 표시용이라 클릭 동작은 없습니다.
 */
export function Badge({
  type = 'neutral-solid',
  size = 'small',
  shape = 'square',
  children,
  className,
  ...rest
}: BadgeProps) {
  const classes = [styles.badge, styles[size], styles[shape], styles[type], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      <span className={styles.label}>{children}</span>
    </span>
  );
}

export default Badge;
