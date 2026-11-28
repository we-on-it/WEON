import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './FilterButton.module.css';

export type FilterButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
  ref?: Ref<HTMLButtonElement>;
  /** Figma `label` (예: 프로젝트 전체) */
  children: string;
};

/**
 * Figma `FilterButton` 컴포넌트 (node 867:18332). 목록을 거르는 드롭다운 트리거.
 * `DropdownMenu`의 trigger로 넣으면 state=open(테두리 + chevron-up)은 Radix가 주는 data-state=open으로,
 * state=hover는 CSS :hover로 처리합니다.
 */
export function FilterButton({ children, className, ...rest }: FilterButtonProps) {
  return (
    <button type="button" className={[styles.button, className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.label}>{children}</span>
      <Icon name="chevron-down" size={16} className={styles.chevronDown} />
      <Icon name="chevron-up" size={16} className={styles.chevronUp} />
    </button>
  );
}

export default FilterButton;
