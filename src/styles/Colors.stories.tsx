import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import colorsCss from './colors.css?raw';

/** CSS 파일을 그대로 읽어 그룹별 변수 목록으로 변환 (토큰 갱신 시 자동 반영) */
type Token = { name: string; value: string };
function parseTokenGroups(...sources: string[]) {
  const groups = new Map<string, Token[]>();
  for (const css of sources) {
    let current: Token[] | undefined;
    for (const line of css.split('\n')) {
      const header = line.match(/\/\* (\w[\w-]*\/[\w-]+) \*\//);
      if (header) {
        if (!groups.has(header[1])) groups.set(header[1], []);
        current = groups.get(header[1]);
      }
      const decl = line.match(/^\s*(--[\w-]+):\s*(.+);/);
      if (decl && current) current.push({ name: decl[1], value: decl[2] });
    }
  }
  return [...groups].map(([group, tokens]) => ({ group, tokens }));
}

const GROUPS = parseTokenGroups(colorsCss);

const mono: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  wordBreak: 'break-all',
};

const checker: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%),linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%)',
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0,6px 6px',
};

function Swatch({ token, copied, onCopy }: { token: Token; copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      title="클릭해서 var(...) 복사"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'white',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ ...checker, height: 56, width: '100%' }}>
        <div style={{ height: '100%', background: `var(${token.name})` }} />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ ...mono, color: '#111827', fontWeight: 600 }}>{copied ? '복사됨' : token.name}</div>
        <div style={{ ...mono, color: '#6b7280' }}>{token.value}</div>
      </div>
    </button>
  );
}

function ColorGroups({ kind }: { kind: 'palette' | 'semantic' }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (name: string) => {
    void navigator.clipboard?.writeText(`var(${name})`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {GROUPS.filter((g) => g.group.startsWith(kind)).map(({ group, tokens }) => (
        <section key={group}>
          <h3 className="typo-title" style={{ margin: '0 0 12px' }}>
            {group.split('/')[1]}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
            {tokens.map((t) => (
              <Swatch key={t.name} token={t} copied={copied === t.name} onCopy={() => copy(t.name)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Color',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 용도별 색 (화면 작업에는 이 변수를 쓰세요). 클릭하면 var(...) 복사 */
export const Semantic: Story = { render: () => <ColorGroups kind="semantic" /> };

/** 원본 팔레트. semantic이 참조하는 값 */
export const Palette: Story = { render: () => <ColorGroups kind="palette" /> };
