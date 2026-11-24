import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';
import { FILLABLE_ICON_NAMES, ICON_NAMES, type IconName } from './icons';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  args: { name: 'bell', size: 24, fill: false },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: {
      control: 'inline-radio',
      options: [16, 20, 22, 24, 32],
      description: '22 미만 → 16px 원본, 22 이상 → 24px 원본',
    },
    fill: { control: 'boolean', description: 'Fill 버전이 있는 아이콘만 적용' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 단일 아이콘. Controls에서 이름·크기·Fill·색을 바꿔볼 수 있어요 */
export const Playground: Story = {};

const fillable = new Set<IconName>(FILLABLE_ICON_NAMES);

const caption: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.4,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  textAlign: 'center',
  wordBreak: 'break-all',
};

function Gallery({ size, color }: { size: number; color: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (name: string) => {
    void navigator.clipboard?.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 8,
        color,
      }}
    >
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => copy(name)}
          title="클릭해서 이름 복사"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: 'white',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', minHeight: 24 }}>
            <Icon name={name as never} size={size} />
            {fillable.has(name) && <Icon name={name as never} size={size} fill />}
          </div>
          <span style={caption}>{copied === name ? '복사됨' : name}</span>
        </button>
      ))}
    </div>
  );
}

/** 전체 아이콘 (Fill 버전이 있으면 오른쪽에 함께 표시). 클릭하면 이름이 복사돼요 */
export const All: StoryObj<{ size: number; color: string }> = {
  args: { size: 24, color: '#2D333D' },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 20, 22, 24, 32] },
    color: { control: 'color' },
  },
  parameters: { controls: { include: ['size', 'color'] } },
  render: (args) => <Gallery {...args} />,
};
