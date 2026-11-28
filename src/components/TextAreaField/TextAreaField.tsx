import type { CSSProperties, ReactNode, Ref } from 'react';
import { FieldFooter, FieldHeader, useFieldA11y, type FieldAction } from '../Field/Field';
import type { IndicatorType } from '../Indicator/Indicator';
import { TextArea, type TextAreaProps } from '../TextArea/TextArea';
import styles from './TextAreaField.module.css';

export type { FieldAction } from '../Field/Field';

export const TEXT_AREA_FIELD_STATUSES = ['default', 'error', 'over-limit'] as const;
export type TextAreaFieldStatus = (typeof TEXT_AREA_FIELD_STATUSES)[number];

export type TextAreaFieldProps = Omit<TextAreaProps, 'invalid' | 'className' | 'style'> & {
  /** 입력칸(<textarea>)에 연결돼요 */
  ref?: Ref<HTMLTextAreaElement>;
  /**
   * Figma `status` (기본 default)
   * - default: description(회색)
   * - error: description 대신 error(빨강) + TextArea invalid
   * - over-limit: error + 글자 수도 빨강
   */
  status?: TextAreaFieldStatus;
  /** Figma `label`. 필드 제목이며 입력칸과 연결돼요 */
  label: ReactNode;
  /** Figma `indicator`. required("필수", 빨강) · optional("선택", 회색), 생략하면 숨김. required면 입력칸에 aria-required가 붙어요 */
  indicator?: IndicatorType;
  /** Figma `badge`. 뱃지 텍스트 (예: "AI 생성" · 사용자가 직접 고치면 숨김), 생략하면 숨김 */
  badge?: string;
  /** Figma `action`. 헤더 오른쪽 버튼 { label, onClick, icon }, 생략하면 숨김 (예: AI로 초안 쓰기) */
  action?: FieldAction;
  /** Figma `description`. status=default일 때 아래 안내 (회색) */
  description?: ReactNode;
  /** Figma `show-description`. 끄면 안내만 사라지고 글자 수는 남아요. error 문구는 꺼도 보여요 (기본 true) */
  showDescription?: boolean;
  /** Figma `error`. status=error | over-limit일 때 description 자리에 보이는 문구 (빨강) */
  error?: ReactNode;
  /** Figma `counter`. 글자 수 (예: "0 / 300자"), 생략하면 숨김. over-limit에서만 빨강 */
  counter?: ReactNode;
  /** 바깥 래퍼 클래스 */
  className?: string;
  /** 바깥 래퍼 스타일 */
  style?: CSSProperties;
};

/**
 * Figma `TextAreaField` 컴포넌트 (node 867:17616). 라벨 + TextArea + 안내/에러 + 글자 수 한 묶음.
 * 라벨 줄과 안내·에러 줄은 TextInputField와 같이 쓰는 Field 부품입니다.
 * 나머지 props(placeholder, value, onChange, disabled 등)는 TextArea로 그대로 전달돼요.
 */
export function TextAreaField({
  ref,
  status = 'default',
  label,
  indicator,
  badge,
  action,
  description,
  showDescription = true,
  error,
  counter,
  className,
  style,
  id,
  'aria-describedby': ariaDescribedByProp,
  ...textAreaProps
}: TextAreaFieldProps) {
  const invalid = status !== 'default';
  const hasCounter = counter !== undefined && counter !== null && counter !== false && counter !== '';

  const a11y = useFieldA11y({
    id,
    // over-limit도 에러 문구를 보여주는 상태라 Field에는 error로 넘겨요
    status: invalid ? 'error' : 'default',
    description,
    showDescription,
    error,
    describedBy: ariaDescribedByProp,
  });
  const counterId = `${a11y.inputId}-counter`;
  const ariaDescribedBy = [a11y.ariaDescribedBy, hasCounter ? counterId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} style={style}>
      <FieldHeader label={label} htmlFor={a11y.inputId} indicator={indicator} badge={badge} action={action} />
      <TextArea
        {...textAreaProps}
        {...{ ref }}
        id={a11y.inputId}
        invalid={invalid}
        aria-required={indicator === 'required' ? true : textAreaProps['aria-required']}
        aria-describedby={ariaDescribedBy}
      />
      <FieldFooter
        description={description}
        descriptionId={a11y.descriptionId}
        error={error}
        errorId={a11y.errorId}
        hasDescription={a11y.hasDescription}
        hasError={a11y.hasError}
        counter={counter}
        counterId={counterId}
        counterCritical={status === 'over-limit'}
      />
    </div>
  );
}

export default TextAreaField;
