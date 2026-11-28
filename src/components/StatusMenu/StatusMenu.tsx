import type { ReactElement, ReactNode } from 'react';
import { DropdownMenu, MenuRadioGroup, MenuRadioItem } from '../Dropdown/Dropdown';
import styles from './StatusMenu.module.css';

/** src/mocks/types.ts의 TaskStatus와 같은 값 */
export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatusValue = (typeof TASK_STATUSES)[number];

export const STATUS_LABEL: Record<TaskStatusValue, string> = {
  todo: '시작 전',
  in_progress: '진행 중',
  done: '완료',
};

/**
 * TODO(StatusChip): StatusChip 컴포넌트가 생기면 `renderChip` 기본값을 그걸로 바꾸고 이 함수는 지워 주세요.
 * Figma StatusChip 모양을 흉내 낸 임시 칩입니다 (dot 8 + Body2 SemiBold, pill, 최소 높이 32).
 */
export function TempStatusChip({ status }: { status: TaskStatusValue }) {
  return (
    <span className={[styles.tempChip, styles[status]].join(' ')} aria-hidden>
      <span className={styles.dot} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export type StatusMenuProps = {
  /** 지금 상태. 이 항목이 selected(배경 + check)가 돼요 */
  value: TaskStatusValue;
  /** '시작 전' · '진행 중'을 골랐을 때 */
  onValueChange: (value: Exclude<TaskStatusValue, 'done'>) => void;
  /** '완료'를 골랐을 때. 완료는 결과물을 제출해야 바뀌므로 값을 바꾸지 않고 제출 화면으로 보내 주세요 */
  onRequestDone: () => void;
  /**
   * 메뉴를 여는 요소. Figma 규칙: StatusChip(chevron 켬)을 넣어요.
   * ref를 받는 요소여야 해요 (button 등).
   */
  trigger: ReactElement;
  /** 각 행에 그릴 칩. 기본은 임시 칩(TempStatusChip) — StatusChip이 생기면 연결 */
  renderChip?: (status: TaskStatusValue) => ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Figma `StatusMenu` 컴포넌트 (node 877:23215). 칩을 누르면 열리는 완성형 메뉴.
 * 행 = 칩(라벨 숨김) · 완료 행 meta ‘결과물 제출로 이동’ · footer 안내. 문구·순서는 여기 고정입니다.
 */
export function StatusMenu({
  value,
  onValueChange,
  onRequestDone,
  trigger,
  renderChip = (status) => <TempStatusChip status={status} />,
  open,
  onOpenChange,
}: StatusMenuProps) {
  const handleChange = (next: string) => {
    if (next === 'done') onRequestDone();
    else onValueChange(next as Exclude<TaskStatusValue, 'done'>);
  };

  return (
    <DropdownMenu
      trigger={trigger}
      footer="‘완료’는 결과물을 제출해야 바뀌어요"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MenuRadioGroup value={value} onValueChange={handleChange}>
        {TASK_STATUSES.map((status) => (
          <MenuRadioItem
            key={status}
            value={status}
            label={STATUS_LABEL[status]}
            showLabel={false}
            leading={renderChip(status)}
            meta={status === 'done' && value !== 'done' ? '결과물 제출로 이동' : undefined}
          />
        ))}
      </MenuRadioGroup>
    </DropdownMenu>
  );
}

export default StatusMenu;
