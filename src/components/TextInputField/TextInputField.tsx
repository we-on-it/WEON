import type { CSSProperties, ReactNode, Ref } from 'react';
import { FieldFooter, FieldHeader, useFieldA11y, type FieldAction, type FieldStatus } from '../Field/Field';
import type { IndicatorType } from '../Indicator/Indicator';
import { TextInput, type TextInputProps } from '../TextInput/TextInput';
import styles from './TextInputField.module.css';

export { FIELD_STATUSES as TEXT_INPUT_FIELD_STATUSES } from '../Field/Field';
export type { FieldAction } from '../Field/Field';

export type TextInputFieldProps = Omit<TextInputProps, 'invalid' | 'className' | 'style'> & {
  /** 입력칸(<input>)에 연결돼요 */
  ref?: Ref<HTMLInputElement>;
  /** Figma `status`. error면 description 대신 error 문구(빨강)를 보여주고 TextInput을 invalid로 표시해요 (기본 default) */
  status?: FieldStatus;
  /** Figma `label`. 필드 제목이며 입력칸과 연결돼요 */
  label: ReactNode;
  /** Figma `indicator`. required("필수", 빨강) · optional("선택", 회색), 생략하면 숨김. required면 입력칸에 aria-required가 붙어요 */
  indicator?: IndicatorType;
  /** Figma `badge`. 뱃지 텍스트 (예: "AI 생성" · 사용자가 직접 고치면 숨김), 생략하면 숨김 */
  badge?: string;
  /** Figma `action`. 헤더 오른쪽 버튼 { label, onClick, icon }, 생략하면 숨김 */
  action?: FieldAction;
  /** Figma `description`. status=default일 때 아래 안내 (회색) */
  description?: ReactNode;
  /** Figma `show-description`. 끄면 안내 줄째로 사라져요 (빈 간격 없음). error 문구는 꺼도 보여요 (기본 true) */
  showDescription?: boolean;
  /** Figma `error`. status=error일 때 아래 에러 (빨강) */
  error?: ReactNode;
  /** 바깥 래퍼 클래스 */
  className?: string;
  /** 바깥 래퍼 스타일 */
  style?: CSSProperties;
};

/**
 * Figma `TextInputField` 컴포넌트. 라벨 + TextInput + 안내/에러 한 묶음.
 * label은 입력칸과, description·error는 aria-describedby로 연결됩니다.
 * 나머지 props(placeholder, value, showSuffix, suffixText, disabled 등)는 TextInput으로 그대로 전달돼요.
 */
export function TextInputField({
  ref,
  status = 'default',
  label,
  indicator,
  badge,
  action,
  description,
  showDescription = true,
  error,
  className,
  style,
  id,
  'aria-describedby': ariaDescribedByProp,
  ...inputProps
}: TextInputFieldProps) {
  const a11y = useFieldA11y({
    id,
    status,
    description,
    showDescription,
    error,
    describedBy: ariaDescribedByProp,
  });

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')} style={style}>
      <FieldHeader label={label} htmlFor={a11y.inputId} indicator={indicator} badge={badge} action={action} />
      <TextInput
        {...inputProps}
        {...{ ref }}
        id={a11y.inputId}
        invalid={status === 'error'}
        aria-required={indicator === 'required' ? true : inputProps['aria-required']}
        aria-describedby={a11y.ariaDescribedBy}
      />
      <FieldFooter
        description={description}
        descriptionId={a11y.descriptionId}
        error={error}
        errorId={a11y.errorId}
        hasDescription={a11y.hasDescription}
        hasError={a11y.hasError}
      />
    </div>
  );
}

export default TextInputField;
