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

/** 글자 수가 달라도 최소 너비를 지키고, 길면 늘어나요 */
export const LabelLength: Story = {
  parameters: { controls: { include: ['type', 'size', 'shape'] } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args}>3</Badge>
      <Badge {...args}>12</Badge>
      <Badge {...args}>진행 중</Badge>
      <Badge {...args}>마감 D-3</Badge>
    </div>
  ),
};
