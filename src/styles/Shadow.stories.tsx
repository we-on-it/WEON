import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import colorsCss from './colors.css?raw';

/** colors.css의 --shadow-* 변수 목록 */
const SHADOWS = [...colorsCss.matchAll(/^\s*(--shadow-[\w-]+):\s*(.+);/gm)].map(([, name, value]) => ({
  name,
  value,
}));

function ShadowList() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (name: string) => {
    void navigator.clipboard?.writeText(`var(${name})`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', padding: 32, background: 'var(--palette-gray-50)' }}>
      {SHADOWS.map(({ name, value }) => (
        <button
          key={name}
          type="button"
          onClick={() => copy(name)}
          title="클릭해서 var(...) 복사"
          style={{
            width: 240,
            height: 160,
            border: 'none',
            borderRadius: 16,
            background: 'var(--palette-gray-0)',
            boxShadow: `var(${name})`,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: 16,
            textAlign: 'left',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: 600, color: '#111827' }}>{copied === name ? '복사됨' : name}</span>
          <span style={{ color: '#6b7280' }}>{value}</span>
        </button>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Shadow',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

/** Figma effect style. `box-shadow: var(--shadow-weak)` 처럼 사용. 클릭하면 var(...) 복사 */
export const All: StoryObj<typeof meta> = { render: () => <ShadowList /> };
