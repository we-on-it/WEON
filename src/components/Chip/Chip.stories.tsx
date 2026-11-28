import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Chip, CHIP_SHAPES, CHIP_SIZES, CHIP_VARIANTS } from './Chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: 'Figma Chip 컴포넌트. hover·press·disabled는 CSS로 처리합니다.',
      },
    },
  },
  args: {
    children: '라벨',
    variant: 'neutral-solid',
    size: 'medium',
    shape: 'pill',
    selected: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: CHIP_VARIANTS },
    size: { control: 'inline-radio', options: CHIP_SIZES },
    shape: { control: 'inline-radio', options: CHIP_SHAPES },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 모든 prop을 바꿔볼 수 있어요. hover/press는 직접 마우스를 올려 확인하세요 */
export const Playground: Story = {};

/** 클릭하면 selected가 토글돼요 */
export const Toggle: Story = {
  parameters: { controls: { exclude: ['selected'] } },
  render: function Render(args) {
    const [selected, setSelected] = useState(false);
    return <Chip {...args} selected={selected} onClick={() => setSelected((v) => !v)} />;
  },
};

const label: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'nowrap',
};

const grid = (cols: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `180px repeat(${cols}, max-content)`,
  gap: '12px 16px',
  alignItems: 'center',
  justifyItems: 'start',
});

/** 타입 × 선택 상태 */
export const Variants: Story = {
  parameters: { controls: { include: ['size', 'shape', 'disabled'] } },
  render: ({ size, shape, disabled }) => (
    <div style={grid(2)}>
      <span />
      <span style={label}>selected=false</span>
      <span style={label}>selected=true</span>
      {CHIP_VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'contents' }}>
          <span style={label}>{variant}</span>
          {[false, true].map((selected) => (
            <Chip
              key={String(selected)}
              variant={variant}
              size={size}
              shape={shape}
              disabled={disabled}
              selected={selected}
            >
              라벨
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 사이즈별 비교 (높이 28 · 31 · 35) */
export const Sizes: Story = {
  parameters: { controls: { include: ['variant', 'shape', 'selected'] } },
  render: ({ variant, shape, selected }) => (
    <div style={grid(1)}>
      {CHIP_SIZES.map((size) => (
        <div key={size} style={{ display: 'contents' }}>
          <span style={label}>{size}</span>
          <Chip variant={variant} size={size} shape={shape} selected={selected}>
            라벨
          </Chip>
        </div>
      ))}
    </div>
  ),
};

/** 모양별 비교 (모서리 999 · 4) */
export const Shapes: Story = {
  parameters: { controls: { include: ['variant', 'size', 'selected'] } },
  render: ({ variant, size, selected }) => (
    <div style={grid(1)}>
      {CHIP_SHAPES.map((shape) => (
        <div key={shape} style={{ display: 'contents' }}>
          <span style={label}>{shape}</span>
          <Chip variant={variant} size={size} shape={shape} selected={selected}>
            라벨
          </Chip>
        </div>
      ))}
    </div>
  ),
};

/** 비활성 상태 (선택 여부별) */
export const Disabled: Story = {
  parameters: { controls: { include: ['size', 'shape'] } },
  render: ({ size, shape }) => (
    <div style={grid(2)}>
      <span />
      <span style={label}>selected=false</span>
      <span style={label}>selected=true</span>
      {CHIP_VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'contents' }}>
          <span style={label}>{variant}</span>
          {[false, true].map((selected) => (
            <Chip
              key={String(selected)}
              variant={variant}
              size={size}
              shape={shape}
              selected={selected}
              disabled
            >
              라벨
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

const FILTERS = ['전체', '진행 중', '완료', '보류 중'] as const;

/** 실제 사용 예시: 하나만 선택되는 필터 칩 묶음 */
export const FilterGroup: Story = {
  parameters: { controls: { include: ['variant', 'size', 'shape'] } },
  render: function Render({ variant, size, shape }) {
    const [value, setValue] = useState<(typeof FILTERS)[number]>('전체');
    return (
      <div role="group" aria-label="상태 필터" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map((filter) => (
          <Chip
            key={filter}
            variant={variant}
            size={size}
            shape={shape}
            selected={value === filter}
            onClick={() => setValue(filter)}
          >
            {filter}
          </Chip>
        ))}
      </div>
    );
  },
};
