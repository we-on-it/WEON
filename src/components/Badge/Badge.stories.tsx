import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Badge, BADGE_SHAPES, BADGE_SIZES, BADGE_TYPES } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: '뱃지',
    type: 'neutral-solid',
    size: 'small',
    shape: 'square',
  },
  argTypes: {
    type: { control: 'select', options: BADGE_TYPES },
    size: { control: 'inline-radio', options: BADGE_SIZES },
    shape: { control: 'inline-radio', options: BADGE_SHAPES },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 타입·사이즈·모양을 바꿔볼 수 있어요 */
export const Playground: Story = {};

const label: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'nowrap',
};

const combos = BADGE_SIZES.flatMap((size) => BADGE_SHAPES.map((shape) => ({ size, shape })));

/** 타입 × 사이즈 × 모양 (Figma variant 표와 같은 배치) */
export const Variants: Story = {
  parameters: { controls: { include: ['children'] } },
  render: ({ children }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `120px repeat(${combos.length}, max-content)`,
        gap: '12px 20px',
        alignItems: 'center',
        justifyItems: 'start',
      }}
    >
      <span />
      {combos.map(({ size, shape }) => (
        <span key={`${size}-${shape}`} style={label}>
          {size}/{shape}
        </span>
      ))}
      {BADGE_TYPES.map((type) => (
        <div key={type} style={{ display: 'contents' }}>
          <span style={label}>{type}</span>
          {combos.map(({ size, shape }) => (
            <Badge key={`${size}-${shape}`} type={type} size={size} shape={shape}>
              {children}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 최소 너비 = 높이라서 숫자 한 자리는 pill이 원형이 되고, 두 자리 이상(12, 99+)은 옆으로 늘어나요 */
export const LabelLength: Story = {
  args: { type: 'critical-solid', shape: 'pill' },
  parameters: { controls: { include: ['type', 'size', 'shape'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args}>3</Badge>
      <Badge {...args}>12</Badge>
      <Badge {...args}>99+</Badge>
      <Badge {...args}>진행 중</Badge>
      <Badge {...args}>마감 D-3</Badge>
    </div>
  ),
};

/**
 * type=ai는 AI가 만든 값에만 써요 (예: AI 추천, AI 초안).
 * 사용자가 직접 수정하면 뱃지를 숨기거나 neutral-weak "수동"으로 바꿔 주세요.
 */
export const AiUsage: Story = {
  parameters: { controls: { include: ['size', 'shape'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} type="ai">
        AI 추천
      </Badge>
      <Badge {...args} type="ai">
        AI 초안
      </Badge>
      <span style={label}>→ 사용자가 수정하면</span>
      <Badge {...args} type="neutral-weak">
        수동
      </Badge>
    </div>
  ),
};
