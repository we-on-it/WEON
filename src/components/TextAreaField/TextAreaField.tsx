import { useId, type ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import type { IconName } from '../Icon/icons';
import { Indicator, type IndicatorType } from '../Indicator/Indicator';
import { TextArea, type TextAreaProps } from '../TextArea/TextArea';
import styles from './TextAreaField.module.css';

export const TEXT_AREA_FIELD_STATUSES = ['default', 'error', 'over-limit'] as const;
export type TextAreaFieldStatus = (typeof TEXT_AREA_FIELD_STATUSES)[number];

export type TextAreaFieldAction = {
  label: string;
  /** 버튼 앞 아이콘 (예: 'ai') */
  icon?: IconName;
  onClick: () => void;
  disabled?: boolean;
};

export type TextAreaFieldProps = Omit<TextAreaProps, 'invalid'> & {
  /**
   * Figma `status`. 색이 함께 바뀌는 상태
   * - default: 안내 문구(회색)
   * - error: 안내 문구 대신 error(빨강) + TextArea invalid
   * - over-limit: error + 글자 수도 빨강
   */
  status?: TextAreaFieldStatus;
  /** 필드 제목 (Body1/SemiBold) */
  label: ReactNode;
  /** 필수/선택 표시. 없으면 숨김 */
  indicator?: IndicatorType;
  /**
   * AI 뱃지(type=ai). true면 "AI 생성", 문자열이면 그 글자로 표시.
   * AI가 만든 값일 때만 켜고, 사용자가 직접 수정하면 끄세요
   */
  badge?: boolean | string;
  /** 헤더 오른쪽 버튼 (Button neutral-weak · 32). 예: AI로 초안 쓰기 */
  action?: TextAreaFieldAction;
  /** status=default일 때 안내 문구 (회색) */
  description?: ReactNode;
  /** 안내 문구 표시 여부 (기본 true). 꺼도 글자 수와 error 문구는 보여요 */
  showDescription?: boolean;
  /** status=error | over-limit일 때 description 자리에 보이는 문구 (빨강) */
  error?: ReactNode;
  /** 글자 수 표시. 예: "0 / 300자". 없으면 숨김 */
  counter?: ReactNode;
  /** 바깥 묶음에 붙는 className (TextArea에는 textAreaClassName) */
  className?: string;
  textAreaClassName?: string;
};

/**
 * Figma `TextAreaField` 컴포넌트 (node 867:17616).
 * TextArea + 라벨·필수/선택·뱃지·버튼·안내 문구·글자 수.
 */
export function TextAreaField({
  status = 'default',
  label,
  indicator,
  badge = false,
  action,
  description,
  showDescription = true,
  error,
  counter,
  className,
  textAreaClassName,
  id,
  'aria-describedby': ariaDescribedBy,
  ...textAreaProps
}: TextAreaFieldProps) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const messageId = `${autoId}-message`;
  const counterId = `${autoId}-counter`;

  const isError = status !== 'default';
  const message = isError ? error : showDescription ? description : undefined;
  const hasMessage = message !== undefined && message !== null && message !== '';
  const hasCounter = counter !== undefined && counter !== null && counter !== '';
  const badgeLabel = badge === true ? 'AI 생성' : badge || null;

  const describedBy =
    [ariaDescribedBy, hasMessage && messageId, hasCounter && counterId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} data-status={status}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        {indicator && <Indicator type={indicator} />}
        {badgeLabel && (
          <Badge type="ai" size="medium" shape="square">
            {badgeLabel}
          </Badge>
        )}
        <span className={styles.spacer} />
        {action && (
          <Button
            variant="neutral-weak"
            size="xsmall"
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        )}
      </div>

      <TextArea
        {...textAreaProps}
        id={inputId}
        className={textAreaClassName}
        invalid={isError}
        aria-describedby={describedBy}
        aria-required={indicator === 'required' ? true : textAreaProps['aria-required']}
      />

      {(hasMessage || hasCounter) && (
        <div className={styles.footer}>
          {hasMessage && (
            <p
              id={messageId}
              className={[styles.message, isError && styles.critical].filter(Boolean).join(' ')}
              aria-live={isError ? 'polite' : undefined}
            >
              {message}
            </p>
          )}
          {hasCounter && (
            <p
              id={counterId}
              className={[styles.counter, status === 'over-limit' && styles.critical].filter(Boolean).join(' ')}
            >
              {counter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TextAreaField;
