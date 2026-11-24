import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icons';
import styles from './Button.module.css';

export const BUTTON_VARIANTS = [
  'neutral-solid',
  'neutral-weak',
  'neutral-outlined',
  'neutral-ghost',
  'brand-solid',
  'brand-weak',
  'critical-solid',
  'critical-weak',
] as const;
export const BUTTON_SIZES = ['xsmall', 'small', 'medium', 'large'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

/**
 * 사이즈별 아이콘 표시 크기(px). Figma 기준 large만 22, 나머지는 16.
 * Icon 규칙에 따라 22px은 24px 원본, 16px은 16px 원본을 씁니다.
 */
const ICON_SIZE: Record<ButtonSize, number> = {
  xsmall: 16,
  small: 16,
  medium: 16,
  large: 22,
};

type BaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  ref?: Ref<HTMLButtonElement>;
  /** Figma `type`. 색 조합 (기본 neutral-solid) */
  variant?: ButtonVariant;
  /** Figma `size` (기본 medium) */
  size?: ButtonSize;
  /** 아이콘 이름 또는 직접 만든 요소. 이름을 주면 사이즈에 맞는 Icon을 그려요 */
  icon?: IconName | ReactElement;
};

export type ButtonProps = BaseProps &
  (
    | {
        /** 라벨 */
        children: ReactNode;
        /** 아이콘 위치 (Figma `icon-first` / `icon-last`, 기본 start) */
        iconPosition?: 'start' | 'end';
      }
    | {
        /** 아이콘만 있는 버튼은 스크린리더용 이름이 필요해요 */
        children?: never;
        icon: IconName | ReactElement;
        'aria-label': string;
        iconPosition?: never;
      }
  );

/**
 * Figma `Button` 컴포넌트.
 * hover·press·disabled 상태는 CSS(:hover / :active / :disabled)로 처리합니다.
 */
export function Button({
  variant = 'neutral-solid',
  size = 'medium',
  icon,
  iconPosition = 'start',
  children,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const hasLabel = children !== undefined && children !== null && children !== false;
  const iconOnly = !hasLabel && icon !== undefined;

  const iconNode =
    icon === undefined ? null : typeof icon === 'string' ? (
      <Icon name={icon as never} size={ICON_SIZE[size]} className={styles.icon} />
    ) : (
      icon
    );

  const layout = iconOnly
    ? styles.iconOnly
    : iconNode
      ? iconPosition === 'end'
        ? styles.iconLast
        : styles.iconFirst
      : undefined;

  const classes = [styles.button, styles[size], styles[variant], layout, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {iconPosition === 'start' && iconNode}
      {hasLabel && children}
      {iconPosition === 'end' && iconNode}
    </button>
  );
}

export default Button;
