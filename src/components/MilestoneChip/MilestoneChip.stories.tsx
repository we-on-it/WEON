import type { Meta, StoryObj } from '@storybook/react-vite';
import { MILESTONE_TYPES, MilestoneChip } from './MilestoneChip';

const meta = {
  title: 'Components/MilestoneChip',
  component: MilestoneChip,
  args: { type: 'research', name: '사용자 인터뷰' },
  argTypes: { type: { control: 'inline-radio', options: MILESTONE_TYPES } },
} satisfies Meta<typeof MilestoneChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 유형 3가지 */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <MilestoneChip type="research" name="사용자 인터뷰" />
      <MilestoneChip type="production" name="포스터 시안" />
      <MilestoneChip type="presentation" name="중간 발표" />
    </div>
  ),
};
