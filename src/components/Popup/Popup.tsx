import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import styles from './Popup.module.css';

export type PopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** 열림 여부 */
  open: boolean;
  /** 닫기 버튼, Esc, dim 클릭 시 호출 */
  onClose: () => void;
  /** Figma `popupTitle`. 없으면 제목 줄 없이 닫기 버튼만 보여요 */
  title?: ReactNode;
  /** Figma `actionArea`. 하단 우측에 고정되는 버튼들 (보통 neutral-weak + neutral-solid) */
  actions?: ReactNode;
  /** dim을 눌러 닫을지 여부 (기본 true). 입력 중 실수로 닫히면 안 되는 팝업은 false */
  closeOnDimClick?: boolean;
  /** 닫기 버튼의 스크린리더용 이름 */
  closeLabel?: string;
  children?: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Figma `Popup` 컴포넌트 (node 596:34046).
 * 항상 화면 전체를 덮는 dim과 함께 `document.body`에 렌더링됩니다.
 * Esc·dim 클릭으로 닫히고, 열려 있는 동안 포커스는 팝업 안에서만 돌며 뒤 페이지 스크롤은 잠깁니다.
 */
export function Popup({
  open,
  onClose,
  title,
  actions,
  closeOnDimClick = true,
  closeLabel = '닫기',
  className,
  children,
  ...rest
}: PopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const hasTitle = title !== undefined && title !== null && title !== false;

  return createPortal(
    <div
      className={styles.dim}
      onMouseDown={(e) => {
        if (closeOnDimClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTitle ? titleId : undefined}
        tabIndex={-1}
        className={[styles.popup, actions ? styles.hasActions : undefined, className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        <div className={styles.head}>
          {hasTitle && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
          <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Popup;
