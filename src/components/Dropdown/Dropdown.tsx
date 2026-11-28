import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import type { ReactElement, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Dropdown.module.css';

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

/* ── 메뉴 한 줄의 내용 (MenuItem · Select 항목이 같이 씀) ─────────────── */

export type MenuItemContentProps = {
  /** Figma `label` */
  label: ReactNode;
  /** Figma `show-label`. leading에 넣은 칩이 라벨 역할을 할 때 false (기본 true). false여도 스크린리더는 label을 읽어요 */
  showLabel?: boolean;
  /** Figma `leading`. 라벨 앞 아이콘·칩 자리 (Priority · check-square · Avatar 등) */
  leading?: ReactNode;
  /** Figma `description`. 라벨 바로 옆 회색 보조 글자 (예: D-4 ~ 7) */
  description?: ReactNode;
  /** Figma `meta`. 오른쪽 끝 회색 글자 (예: 개수 7) */
  meta?: ReactNode;
  /** Figma `trailing`. 오른쪽 끝 Badge·Tag 자리 */
  trailing?: ReactNode;
};

/** leading → label → description → spacer → meta → trailing → (check) 순서. check는 각 아이템이 붙여요 */
export function MenuItemContent({
  label,
  showLabel = true,
  leading,
  description,
  meta,
  trailing,
}: MenuItemContentProps) {
  return (
    <>
      {leading !== undefined && <span className={styles.leading}>{leading}</span>}
      <span className={showLabel ? styles.label : styles.srOnly}>{label}</span>
      {description !== undefined && <span className={styles.description}>{description}</span>}
      <span className={styles.spacer} aria-hidden />
      {meta !== undefined && <span className={styles.meta}>{meta}</span>}
      {trailing !== undefined && <span className={styles.trailing}>{trailing}</span>}
    </>
  );
}

/**
 * 안 고른 체크박스: Icon/check-square(24)에서 체크 표시를 뺀 빈 상자.
 * 상자 모양(외곽·두께·모서리)은 check-square 원본 경로와 같아요.
 */
function EmptyCheckbox() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      className={styles.checkbox}
    >
      <path
        fillRule="evenodd"
        d="M6.68 20.21C5.73 20.21 5.01 19.96 4.53 19.48C4.04 19 3.8 18.29 3.8 17.36V6.65C3.8 5.71 4.04 5 4.53 4.52C5.01 4.04 5.73 3.8 6.68 3.8H17.32C18.27 3.8 18.99 4.04 19.48 4.53C19.96 5.01 20.21 5.72 20.21 6.65V17.36C20.21 18.29 19.96 19 19.48 19.48C18.99 19.96 18.27 20.21 17.32 20.21H6.68ZM6.79 18.47H17.22C17.62 18.47 17.93 18.37 18.15 18.16C18.37 17.95 18.47 17.63 18.47 17.2V6.8C18.47 6.38 18.37 6.06 18.15 5.84C17.93 5.63 17.62 5.53 17.22 5.53H6.79C6.38 5.53 6.06 5.63 5.84 5.84C5.63 6.06 5.53 6.38 5.53 6.8V17.2C5.53 17.63 5.63 17.95 5.84 18.16C6.06 18.37 6.38 18.47 6.79 18.47Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 18×18 체크 · foreground/brand. selected일 때만 보여요 */
function Check() {
  return <Icon name="check" size={18} className={styles.check} />;
}

/* ── DropdownMenu (Figma Menu) ─────────────────────────────────────── */

export type DropdownMenuProps = {
  /** 메뉴를 여는 요소 (FilterButton, 칩 등). 반드시 ref를 받는 요소 하나 */
  trigger: ReactElement;
  /** MenuItem · MenuRadioGroup · MenuCheckboxItem */
  children: ReactNode;
  /** Figma `section-title`. 맨 위 작은 제목 (예: AI 추천) */
  sectionTitle?: ReactNode;
  /** Figma `footer`. 맨 아래 안내 문구, 위에 구분선 */
  footer?: ReactNode;
  /** 열림 상태를 밖에서 제어할 때 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 트리거 기준 가로 정렬 (기본 start) */
  align?: 'start' | 'center' | 'end';
  /** 트리거와 메뉴 사이 거리(px) */
  sideOffset?: number;
  /** 메뉴 너비. Figma 기본 280 */
  width?: number | string;
  className?: string;
};

/**
 * Figma `Menu` 컴포넌트 (node 867:18204). Radix DropdownMenu 기반이라
 * 열기·닫기, ↑/↓ 이동, Enter 선택, Esc·바깥 클릭 닫기, 화면 끝에서 위치 뒤집기가 기본으로 동작합니다.
 */
export function DropdownMenu({
  trigger,
  children,
  sectionTitle,
  footer,
  open,
  onOpenChange,
  align = 'start',
  sideOffset = 4,
  width = 280,
  className,
}: DropdownMenuProps) {
  return (
    <RadixMenu.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className={cx(styles.menu, className)}
          style={{ width }}
        >
          {sectionTitle !== undefined && (
            <RadixMenu.Label className={styles.sectionTitle}>{sectionTitle}</RadixMenu.Label>
          )}
          {children}
          {footer !== undefined && <div className={styles.footer}>{footer}</div>}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}

/* ── MenuItem: 누르면 동작 (선택 상태 없음) ─────────────────────────── */

export type MenuItemProps = MenuItemContentProps & {
  /** 눌렀을 때. 기본으로 메뉴가 닫혀요 (event.preventDefault()로 막기) */
  onSelect?: (event: Event) => void;
  /** Figma `disabled`. opacity 40%, 키보드 이동에서 건너뜀 */
  disabled?: boolean;
  /** Figma `selected`. 한 개 고르기는 MenuRadioGroup을 쓰고, 여기선 표시만 필요할 때 */
  selected?: boolean;
  className?: string;
};

/** Figma `MenuItem` 컴포넌트 (node 867:18203). hover·키보드 포커스는 data-highlighted로 처리 */
export function MenuItem({ onSelect, disabled, selected = false, className, ...content }: MenuItemProps) {
  return (
    <RadixMenu.Item
      onSelect={onSelect}
      disabled={disabled}
      data-selected={selected || undefined}
      className={cx(styles.item, className)}
    >
      <MenuItemContent {...content} />
      {selected && <Check />}
    </RadixMenu.Item>
  );
}

/* ── 한 개 고르기 ─────────────────────────────────────────────────── */

export type MenuRadioGroupProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
};

/** 한 개 고르기. 고른 항목은 selected 모양(배경 + check)이 되고 aria-checked가 붙어요 */
export function MenuRadioGroup({ value, onValueChange, children }: MenuRadioGroupProps) {
  return (
    <RadixMenu.RadioGroup value={value} onValueChange={onValueChange} className={styles.group}>
      {children}
    </RadixMenu.RadioGroup>
  );
}

export type MenuRadioItemProps = MenuItemContentProps & {
  value: string;
  disabled?: boolean;
  /** 기본 동작(값 바꾸고 닫기) 전에 불려요. event.preventDefault()로 둘 다 막을 수 있어요 */
  onSelect?: (event: Event) => void;
  className?: string;
};

export function MenuRadioItem({ value, disabled, onSelect, className, ...content }: MenuRadioItemProps) {
  return (
    <RadixMenu.RadioItem
      value={value}
      disabled={disabled}
      onSelect={onSelect}
      className={cx(styles.item, className)}
    >
      <MenuItemContent {...content} />
      <RadixMenu.ItemIndicator className={styles.indicator}>
        <Check />
      </RadixMenu.ItemIndicator>
    </RadixMenu.RadioItem>
  );
}

/* ── 여러 개 고르기 ───────────────────────────────────────────────── */

export type MenuCheckboxItemProps = Omit<MenuItemContentProps, 'leading'> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * 여러 개 고르기. leading에 체크박스(24)가 오고 selected 배경·check는 쓰지 않아요.
 * 고름 = Icon/check-square 채움, 안 고름 = 체크 없는 빈 상자.
 * 하나 고를 때마다 메뉴가 닫히지 않습니다.
 */
export function MenuCheckboxItem({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...content
}: MenuCheckboxItemProps) {
  return (
    <RadixMenu.CheckboxItem
      checked={checked}
      onCheckedChange={(next) => onCheckedChange(next === true)}
      onSelect={(event) => event.preventDefault()}
      disabled={disabled}
      className={cx(styles.item, styles.checkboxItem, className)}
    >
      <MenuItemContent
        {...content}
        leading={
          checked ? (
            <Icon name="check-square" fill size={24} className={styles.checkbox} />
          ) : (
            <EmptyCheckbox />
          )
        }
      />
    </RadixMenu.CheckboxItem>
  );
}

export default DropdownMenu;
