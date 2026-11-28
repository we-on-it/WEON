import { useEffect, useRef, useState, type ReactNode } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extensions';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icons';
import styles from './DocumentEditor.module.css';

/** 글자색 선택지. 팀 semantic 변수만 씁니다 */
export const TEXT_COLORS = [
  { label: '기본', value: null },
  { label: '회색', value: 'var(--foreground-tertiary)' },
  { label: '브랜드', value: 'var(--foreground-brand)' },
  { label: '빨강', value: 'var(--foreground-critical)' },
  { label: '주황', value: 'var(--foreground-warning)' },
  { label: '초록', value: 'var(--foreground-success)' },
  { label: 'AI', value: 'var(--foreground-ai)' },
] as const;

/** 형광펜 선택지 */
export const HIGHLIGHT_COLORS = [
  { label: '없음', value: null },
  { label: '브랜드', value: 'var(--fill-brand-weak)' },
  { label: '빨강', value: 'var(--fill-critical-weak)' },
  { label: '주황', value: 'var(--fill-warning-weak)' },
  { label: '초록', value: 'var(--fill-success-weak)' },
  { label: 'AI', value: 'var(--fill-ai-weak)' },
] as const;

export type DocumentEditorProps = {
  /** 처음 보여줄 내용 (HTML). 저장된 문서를 불러올 때 여기에 넣어요 */
  content?: string;
  /** 내용이 바뀔 때마다 HTML을 알려줘요. 저장 기능은 여기에 연결하세요 */
  onChange?: (html: string) => void;
  /** false면 읽기 전용 (툴바 숨김) */
  editable?: boolean;
  /** 빈 문서일 때 보이는 안내 문구 */
  placeholder?: string;
  className?: string;
};

/**
 * 문서 편집기 (Tiptap 기반). 서식 편집까지만 지원합니다.
 * 저장·불러오기는 하지 않고 `content` / `onChange`로 바깥에 맡깁니다.
 */
export function DocumentEditor({
  content = '',
  onChange,
  editable = true,
  placeholder = '내용을 입력하세요',
  className,
}: DocumentEditorProps) {
  // onChange가 매 렌더마다 바뀌어도 에디터를 다시 만들지 않도록 ref에 보관
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChangeRef.current?.(editor.getHTML()),
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {editor && editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className={styles.content} />
    </div>
  );
}

// ── 툴바 ────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
  // 커서 위치가 바뀔 때마다 버튼 눌림 상태를 다시 계산
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      block: e.isActive('heading', { level: 1 })
        ? 'h1'
        : e.isActive('heading', { level: 2 })
          ? 'h2'
          : e.isActive('heading', { level: 3 })
            ? 'h3'
            : 'p',
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      color: (e.getAttributes('textStyle').color as string | undefined) ?? null,
      highlight: (e.getAttributes('highlight').color as string | undefined) ?? null,
      alignLeft: e.isActive({ textAlign: 'left' }),
      alignCenter: e.isActive({ textAlign: 'center' }),
      alignRight: e.isActive({ textAlign: 'right' }),
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      link: e.isActive('link'),
      linkHref: (e.getAttributes('link').href as string | undefined) ?? '',
    }),
  });

  const chain = () => editor.chain().focus();

  const setBlock = (v: string) => {
    if (v === 'p') chain().setParagraph().run();
    else chain().setHeading({ level: Number(v[1]) as 1 | 2 | 3 }).run();
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="서식">
      <ToolButton label="실행 취소" icon="undo" disabled={!s.canUndo} onClick={() => chain().undo().run()} />
      <ToolButton label="다시 실행" icon="redo" disabled={!s.canRedo} onClick={() => chain().redo().run()} />
      <Divider />

      <select
        className={styles.select}
        aria-label="문단 형식"
        value={s.block}
        onChange={(e) => setBlock(e.target.value)}
      >
        <option value="p">본문</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>
      <Divider />

      {/* B·I·U·S 아이콘은 아직 Figma에 없어 글자로 표시합니다 */}
      <ToolButton label="굵게 (Ctrl+B)" active={s.bold} onClick={() => chain().toggleBold().run()}>
        <b>B</b>
      </ToolButton>
      <ToolButton label="기울임 (Ctrl+I)" active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <i style={{ fontFamily: 'serif' }}>I</i>
      </ToolButton>
      <ToolButton label="밑줄 (Ctrl+U)" active={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <u>U</u>
      </ToolButton>
      <ToolButton label="취소선" active={s.strike} onClick={() => chain().toggleStrike().run()}>
        <s>S</s>
      </ToolButton>
      <Divider />

      <ColorPicker
        label="글자색"
        icon="text-color"
        options={TEXT_COLORS}
        current={s.color}
        kind="text"
        onPick={(v) => (v ? chain().setColor(v).run() : chain().unsetColor().run())}
      />
      <ColorPicker
        label="형광펜"
        icon="highlight"
        options={HIGHLIGHT_COLORS}
        current={s.highlight}
        kind="fill"
        onPick={(v) => (v ? chain().setHighlight({ color: v }).run() : chain().unsetHighlight().run())}
      />
      <Divider />

      <ToolButton label="왼쪽 정렬" icon="align-left" active={s.alignLeft} onClick={() => chain().setTextAlign('left').run()} />
      <ToolButton label="가운데 정렬" icon="align-center" active={s.alignCenter} onClick={() => chain().setTextAlign('center').run()} />
      <ToolButton label="오른쪽 정렬" icon="align-right" active={s.alignRight} onClick={() => chain().setTextAlign('right').run()} />
      <Divider />

      <ToolButton label="글머리 목록" icon="list-bullet" active={s.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolButton label="번호 목록" icon="list-number" active={s.orderedList} onClick={() => chain().toggleOrderedList().run()} />
      <Divider />

      <LinkButton editor={editor} active={s.link} href={s.linkHref} />
    </div>
  );
}

type ToolButtonProps = {
  label: string;
  icon?: IconName;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children?: ReactNode;
};

function ToolButton({ label, icon, active = false, disabled, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      className={styles.tool}
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-active={active || undefined}
      disabled={disabled}
      // 버튼을 눌러도 에디터의 선택 영역이 풀리지 않게
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {icon ? <Icon name={icon as never} size={16} /> : children}
    </button>
  );
}

function Divider() {
  return <span className={styles.divider} aria-hidden />;
}

/** 버튼을 누르면 아래에 뜨는 작은 창. 바깥을 누르거나 Esc를 누르면 닫혀요 */
function Popover({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.parentElement?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} className={styles.popover}>
      {children}
    </div>
  );
}

function ColorPicker({
  label,
  icon,
  options,
  current,
  kind,
  onPick,
}: {
  label: string;
  icon: IconName;
  options: readonly { label: string; value: string | null }[];
  current: string | null;
  kind: 'text' | 'fill';
  onPick: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.anchor}>
      <ToolButton label={label} icon={icon} active={open || current !== null} onClick={() => setOpen((o) => !o)} />
      <Popover open={open} onClose={() => setOpen(false)}>
        <div className={styles.swatches} role="listbox" aria-label={label}>
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              role="option"
              aria-selected={current === o.value}
              title={o.label}
              aria-label={o.label}
              className={styles.swatch}
              data-selected={current === o.value || undefined}
              style={kind === 'text' ? { color: o.value ?? undefined } : { background: o.value ?? undefined }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(o.value);
                setOpen(false);
              }}
            >
              {kind === 'text' ? '가' : o.value === null ? <Icon name="close" size={16} /> : null}
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
}

function LinkButton({ editor, active, href }: { editor: Editor; active: boolean; href: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const toggle = () => {
    setUrl(href);
    setOpen((o) => !o);
  };

  const apply = () => {
    const v = url.trim();
    if (!v) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const withProtocol = /^[a-z]+:\/\//i.test(v) ? v : `https://${v}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: withProtocol }).run();
    }
    setOpen(false);
  };

  return (
    <div className={styles.anchor}>
      <ToolButton label="링크" icon="link" active={active || open} onClick={toggle} />
      <Popover open={open} onClose={() => setOpen(false)}>
        <form
          className={styles.linkForm}
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
        >
          <input
            autoFocus
            className={styles.input}
            type="text"
            inputMode="url"
            placeholder="https://"
            aria-label="링크 주소"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className={styles.applyButton}>
            적용
          </button>
          {active && (
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                setOpen(false);
              }}
            >
              삭제
            </button>
          )}
        </form>
      </Popover>
    </div>
  );
}

export default DocumentEditor;
