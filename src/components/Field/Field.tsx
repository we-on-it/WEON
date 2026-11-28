import { useId, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import type { IconName } from '../Icon/icons';
import { Indicator, type IndicatorType } from '../Indicator/Indicator';
import styles from './Field.module.css';

/*
 * TextInputField · TextAreaField가 같이 쓰는 라벨 줄(FieldHeader)과 안내·에러 줄(FieldFooter).
 * 접근성 연결(label ↔ 입력칸, aria-describedby)은 useFieldA11y로 한 번에 맞춥니다.
 */

export const FIELD_STATUSES = ['default', 'error'] as const;
export type FieldStatus = (typeof FIELD_STATUSES)[number];

/** 헤더 오른쪽 버튼 설정 */
export type FieldAction = {
  /** 버튼 라벨 */
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 라벨 앞 아이콘 (Icon 이름 또는 직접 만든 요소) */
  icon?: IconName | ReactElement;
  disabled?: boolean;
};

/* ── 접근성 id ──────────────────────────────────────── */

export type FieldA11yOptions = {
  /** 입력칸 id. 생략하면 자동으로 만들어요 */
  id?: string;
  status: FieldStatus;
  description?: ReactNode;
  showDescription: boolean;
  error?: ReactNode;
  /** 사용자가 직접 넘긴 aria-describedby (뒤에 이어 붙여요) */
  describedBy?: string;
};

/** 안내·에러 중 지금 보이는 것을 정하고, 입력칸에 붙일 id·aria-describedby를 만들어요 */
export function useFieldA11y({ id, status, description, showDescription, error, describedBy }: FieldA11yOptions) {
  const autoId = useId();
  const inputId = id ?? `field-${autoId}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const hasError = status === 'error' && hasContent(error);
  const hasDescription = !hasError && status !== 'error' && showDescription && hasContent(description);

  const ariaDescribedBy =
    [hasError ? errorId : undefined, hasDescription ? descriptionId : undefined, describedBy]
      .filter(Boolean)
      .join(' ') || undefined;

  return { inputId, descriptionId, errorId, hasError, hasDescription, ariaDescribedBy };
}

const hasContent = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/* ── FieldHeader ────────────────────────────────────── */

export type FieldHeaderProps = {
  /** Figma `label`. 필드 제목 */
  label: ReactNode;
  /** label이 가리킬 입력칸 id */
  htmlFor: string;
  /** Figma `indicator`. 필수/선택 표시, 생략하면 숨김 */
  indicator?: IndicatorType;
  /** Figma `badge`. 뱃지 텍스트 (예: "AI 생성"), 생략하면 숨김 */
  badge?: string;
  /** Figma `action`. 헤더 오른쪽 버튼, 생략하면 숨김 */
  action?: FieldAction;
};

export function FieldHeader({ label, htmlFor, indicator, badge, action }: FieldHeaderProps) {
  return (
    <div className={styles.header}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {indicator && <Indicator type={indicator} />}
      {badge && (
        <Badge type="ai" size="medium" className={styles.badge}>
          {badge}
        </Badge>
      )}
      {action && (
        <span className={styles.action}>
          <Button
            variant="neutral-weak"
            size="xsmall"
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        </span>
      )}
    </div>
  );
}

/* ── FieldFooter ────────────────────────────────────── */

export type FieldFooterProps = {
  /** 지금 보일 안내 (useFieldA11y의 hasDescription) */
  description?: ReactNode;
  descriptionId: string;
  /** 지금 보일 에러 (useFieldA11y의 hasError) */
  error?: ReactNode;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
};

/** 보일 문구가 없으면 줄째로 렌더링하지 않아 빈 간격이 생기지 않아요 */
export function FieldFooter({ description, descriptionId, error, errorId, hasDescription, hasError }: FieldFooterProps) {
  if (!hasDescription && !hasError) return null;

  return (
    <div className={styles.footer}>
      {hasError ? (
        <p id={errorId} className={`${styles.message} ${styles.error}`} aria-live="polite">
          {error}
        </p>
      ) : (
        <p id={descriptionId} className={`${styles.message} ${styles.description}`}>
          {description}
        </p>
      )}
    </div>
  );
}
