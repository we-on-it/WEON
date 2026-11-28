import type { Meta, StoryObj } from '@storybook/react-vite';
import { Indicator, INDICATOR_TYPES } from './Indicator';

const meta = {
  title: 'Components/Indicator',
  component: Indicator,
  parameters: {
    docs: {
      description: {
        component: 'Figma indicator 컴포넌트. 입력 필드 라벨 옆에 필수·선택 여부를 표시합니다.',
      },
    },
  },
  args: {
    type: 'required',
  },
  argTypes: {
    type: { control: 'inline-radio', options: INDICATOR_TYPES },
  },
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 type을 바꿔볼 수 있어요 */
export const Playground: Story = {};

/** 필수(빨강) · 선택(회색) */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {INDICATOR_TYPES.map((type) => (
        <Indicator key={type} type={type} />
      ))}
    </div>
  ),
};
