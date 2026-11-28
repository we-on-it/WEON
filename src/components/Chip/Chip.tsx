import type { ButtonHTMLAttributes, Ref } from 'react';
import styles from './Chip.module.css';

export const CHIP_VARIANTS = ['neutral-solid', 'neutral-outline-strong'] as const;
export const CHIP_SIZES = ['small', 'medium', 'large'] as const;
export const CHIP_SHAPES = ['pill', 'square'] as const;

export type ChipVariant = (typeof CHIP_VARIANTS)[number];
export type ChipSize = (typeof CHIP_SIZES)[number];
export type ChipShape = (typeof CHIP_SHAPES)[number];

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
  ref?: Ref<HTMLButtonElement>;
  /** Figma `type`. 선택되지 않았을 때의 색 조합. selected=true면 두 타입 모양이 같아요 (기본 neutral-solid) */
  variant?: ChipVariant;
  /** Figma `size`. 높이 28 · 31 · 35 (기본 medium) */
  size?: ChipSize;
  /** Figma `shape`. 모서리 pill 999 · square 4 (기본 pill) */
  shape?: ChipShape;
  /** Figma `selected`. 선택 상태이며 aria-pressed로도 전달돼요 (기본 false) */
  selected?: boolean;
  /** Figma `disabled`. opacity 40%, 클릭·hover·press 효과 없음 (기본 false) */
  disabled?: boolean;
  /** Figma `label`. 칩에 표시할 텍스트 */
  children: string;
};

/**
 * Figma `Chip` 컴포넌트.
 * hover·press·disabled 상태(Figma `state`)는 CSS(:hover / :active / :disabled)로 처리합니다.
 */
export function Chip({
  variant = 'neutral-solid',
  size = 'medium',
  shape = 'pill',
  selected = false,
  disabled = false,
  children,
  className,
  ...rest
}: ChipProps) {
  const classes = [
    styles.chip,
    styles[size],
    styles[shape],
    styles[variant],
    selected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Chip;
