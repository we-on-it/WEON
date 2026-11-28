import type { Meta, StoryObj } from '@storybook/react-vite';
import { INDICATOR_TYPES, Indicator } from './Indicator';

const meta = {
  title: 'Components/Indicator',
  component: Indicator,
  args: { type: 'required' },
  argTypes: {
    type: { control: 'inline-radio', options: INDICATOR_TYPES },
  },
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 필드 라벨 옆에 붙는 필수/선택 표시 */
export const Playground: Story = {};

/** Figma variant 2종 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Indicator type="required" />
      <Indicator type="optional" />
    </div>
  ),
};
