import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ICON_NAMES } from '../Icon/icons';
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: '라벨',
    variant: 'neutral-solid',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: BUTTON_VARIANTS },
    size: { control: 'inline-radio', options: BUTTON_SIZES },
    icon: { control: 'select', options: [undefined, ...ICON_NAMES] },
    iconPosition: { control: 'inline-radio', options: ['start', 'end'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 타입·사이즈·아이콘을 바꿔볼 수 있어요. hover/press는 직접 마우스를 올려 확인하세요 */
export const Playground: Story = {};

export const WithIcon: Story = {
  args: { icon: 'plus' },
};

export const IconLast: Story = {
  args: { icon: 'chevron-right', iconPosition: 'end' },
};

export const IconOnly: Story = {
  args: { children: undefined, icon: 'plus', 'aria-label': '추가' } as never,
};

const label: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'nowrap',
};

const grid = (cols: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `140px repeat(${cols}, max-content)`,
  gap: '12px 16px',
  alignItems: 'center',
  justifyItems: 'start',
});

/** 타입 × 레이아웃 (Figma variant 표와 같은 배치) */
export const Variants: Story = {
  parameters: { controls: { include: ['size', 'disabled'] } },
  render: ({ size, disabled }) => (
    <div style={grid(4)}>
      <span />
      {['text-only', 'icon-first', 'icon-last', 'icon-only'].map((h) => (
        <span key={h} style={label}>
          {h}
        </span>
      ))}
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'contents' }}>
          <span style={label}>{variant}</span>
          <Button variant={variant} size={size} disabled={disabled}>
            라벨
          </Button>
          <Button variant={variant} size={size} disabled={disabled} icon="plus">
            라벨
          </Button>
          <Button variant={variant} size={size} disabled={disabled} icon="plus" iconPosition="end">
            라벨
          </Button>
          <Button variant={variant} size={size} disabled={disabled} icon="plus" aria-label="추가" />
        </div>
      ))}
    </div>
  ),
};

/** 사이즈별 비교 */
export const Sizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div style={grid(4)}>
      {BUTTON_SIZES.map((size) => (
        <div key={size} style={{ display: 'contents' }}>
          <span style={label}>{size}</span>
          <Button variant={variant} size={size}>
            라벨
          </Button>
          <Button variant={variant} size={size} icon="plus">
            라벨
          </Button>
          <Button variant={variant} size={size} icon="plus" iconPosition="end">
            라벨
          </Button>
          <Button variant={variant} size={size} icon="plus" aria-label="추가" />
        </div>
      ))}
    </div>
  ),
};
