import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { INDICATOR_TYPES } from '../Indicator/Indicator';
import { TEXT_INPUT_FIELD_STATUSES, TextInputField } from './TextInputField';

const meta = {
  title: 'Components/TextInputField',
  component: TextInputField,
  parameters: {
    docs: {
      description: {
        component:
          'Figma TextInputField 컴포넌트. 라벨 + TextInput + 안내/에러 한 묶음이며, 라벨 줄과 안내·에러 줄은 TextAreaField와 같이 쓰는 Field 부품입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 616, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    status: 'default',
    label: '제목',
    indicator: 'required',
    placeholder: '플레이스홀더',
    description: '안내 문구가 들어갑니다',
    showDescription: true,
    error: '에러 문구가 들어갑니다',
    disabled: false,
    showSuffix: false,
    suffixText: 'Enter로 등록',
  },
  argTypes: {
    status: { control: 'inline-radio', options: TEXT_INPUT_FIELD_STATUSES },
    label: { control: 'text' },
    indicator: { control: 'inline-radio', options: [undefined, ...INDICATOR_TYPES] },
    badge: { control: 'text' },
    action: { control: 'object' },
    description: { control: 'text' },
    showDescription: { control: 'boolean' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    showSuffix: { control: 'boolean' },
    suffixText: { control: 'text' },
  },
} satisfies Meta<typeof TextInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 모든 prop을 바꿔볼 수 있어요 */
export const Playground: Story = {};

/** status=default: 아래에 회색 안내 문구 */
export const Default: Story = {};

/** status=error: 안내 대신 빨간 에러 문구, 입력칸 테두리도 빨강 */
export const ErrorStatus: Story = {
  args: { status: 'error', defaultValue: '입력값' },
};

/** showDescription=false: 안내 줄이 통째로 사라져요 (빈 간격 없음) */
export const WithoutDescription: Story = {
  args: { showDescription: false, indicator: 'optional' },
};

/** 뱃지와 헤더 오른쪽 버튼을 켠 모습 */
export const WithBadgeAndAction: Story = {
  args: {
    badge: 'AI 생성',
    action: { label: 'AI로 다시 쓰기' },
    defaultValue: 'AI가 만든 제목',
  },
};

/** 실제 사용 예시: 비어 있으면 에러, 입력하면 다시 안내로 돌아가요 */
export const Validation: Story = {
  parameters: { controls: { include: ['label', 'indicator', 'placeholder'] } },
  render: function Render(args) {
    const [value, setValue] = useState('');
    const [touched, setTouched] = useState(false);
    const invalid = touched && value.trim() === '';
    return (
      <TextInputField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        status={invalid ? 'error' : 'default'}
        description="팀원에게 보이는 이름이에요"
        error="제목을 입력해 주세요"
      />
    );
  },
};
