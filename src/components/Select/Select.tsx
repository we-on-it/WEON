import * as RadixSelect from '@radix-ui/react-select';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon';
import menuStyles from '../Dropdown/Dropdown.module.css';
import type { MenuItemContentProps } from '../Dropdown/Dropdown';
import styles from './Select.module.css';

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

export type SelectProps = {
  ref?: Ref<HTMLButtonElement>;
  /** 고른 값. 없으면(undefined·'') placeholder가 보여요 (Figma `has-value`) */
  value?: string;
  onValueChange: (value: string) => void;
  /** Figma `placeholder` (기본 '선택하세요') */
  placeholder?: string;
  /** Figma `disabled`. opacity 40% */
  disabled?: boolean;
  /** Figma `invalid`. 테두리 border/critical. 에러 문구는 바깥(Field)에서 */
  invalid?: boolean;
  /** Figma `leading`. 고른 항목의 아이콘(Priority · Avatar 등)을 값 앞에 보여줄 때 */
  leading?: ReactNode;
  /** Figma `description`. 값 옆 회색 글자 (예: 마일스톤 기간 11/9 – 11/20) */
  description?: ReactNode;
  /** Figma `trailing`. 값 옆 Badge·Tag (예: 우선순위 ‘자동’) */
  trailing?: ReactNode;
  /** 메뉴 맨 아래 안내 문구 */
  footer?: ReactNode;
  /** SelectItem들 */
  children: ReactNode;
  /** 폼 제출용 이름 */
  name?: string;
  required?: boolean;
  /** 화면에 보이는 입력칸 이름과 연결 (Figma: field label은 Select 밖 화면 텍스트) */
  'aria-labelledby'?: string;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

/**
 * Figma `Select` 컴포넌트 (node 867:18319). 폼 안에서 하나를 고르는 트리거 + 메뉴.
 * Radix Select 기반이라 열기·닫기, ↑/↓·글자 입력으로 이동, Esc 닫기, 스크린리더 연결이 기본으로 동작합니다.
 * state=open(테두리 border/focus + chevron-up)은 data-state=open으로 처리합니다.
 */
export function Select({
  ref,
  value,
  onValueChange,
  placeholder = '선택하세요',
  disabled = false,
  invalid = false,
  leading,
  description,
  trailing,
  footer,
  children,
  name,
  required,
  id,
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
}: SelectProps) {
  const hasValue = value !== undefined && value !== '';
  return (
    <RadixSelect.Root
      value={hasValue ? value : ''}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <RadixSelect.Trigger
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        className={cx(styles.trigger, invalid && styles.invalid, className)}
      >
        {hasValue && leading !== undefined && <span className={styles.slot}>{leading}</span>}
        <span className={styles.value}>
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        {description !== undefined && <span className={styles.description}>{description}</span>}
        {trailing !== undefined && <span className={styles.slot}>{trailing}</span>}
        <span className={styles.spacer} aria-hidden />
        <RadixSelect.Icon asChild>
          <span className={styles.icon}>
            <Icon name="chevron-down" size={16} className={styles.chevronDown} />
            <Icon name="chevron-up" size={16} className={styles.chevronUp} />
          </span>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content position="popper" sideOffset={4} collisionPadding={8} className={cx(menuStyles.menu, styles.content)}>
          <RadixSelect.Viewport className={styles.viewport}>{children}</RadixSelect.Viewport>
          {footer !== undefined && <div className={menuStyles.footer}>{footer}</div>}
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

export type SelectItemProps = Omit<MenuItemContentProps, 'label' | 'showLabel'> & {
  value: string;
  /** 항목 라벨. 고르면 트리거에도 이 글자가 보여요 */
  children: string;
  disabled?: boolean;
  className?: string;
};

/** Select 안의 한 줄. 모양은 MenuItem과 같고, 고른 항목엔 selected 배경 + check가 붙어요 */
export function SelectItem({
  value,
  children,
  disabled,
  leading,
  description,
  meta,
  trailing,
  className,
}: SelectItemProps) {
  return (
    <RadixSelect.Item value={value} disabled={disabled} className={cx(menuStyles.item, className)}>
      {leading !== undefined && <span className={menuStyles.leading}>{leading}</span>}
      <RadixSelect.ItemText>
        <span className={menuStyles.label}>{children}</span>
      </RadixSelect.ItemText>
      {description !== undefined && <span className={menuStyles.description}>{description}</span>}
      <span className={menuStyles.spacer} aria-hidden />
      {meta !== undefined && <span className={menuStyles.meta}>{meta}</span>}
      {trailing !== undefined && <span className={menuStyles.trailing}>{trailing}</span>}
      <RadixSelect.ItemIndicator className={menuStyles.indicator}>
        <Icon name="check" size={18} className={menuStyles.check} />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
}

export default Select;
