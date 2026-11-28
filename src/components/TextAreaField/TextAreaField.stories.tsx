import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { INDICATOR_TYPES } from '../Indicator/Indicator';
import { TEXT_AREA_FIELD_STATUSES, TextAreaField, type TextAreaFieldStatus } from './TextAreaField';

const MAX = 300;
const DESCRIPTION = '붙여넣기는 막혀있어요. 직접 입력해 주세요.';
const ERROR = '핵심 요약을 입력해 주세요.';

const meta = {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  parameters: {
    docs: {
      description: {
        component:
          'Figma TextAreaField 컴포넌트. 라벨 + TextArea + 안내/에러 + 글자 수 한 묶음이며, 라벨 줄과 안내·에러 줄은 TextInputField와 같이 쓰는 Field 부품입니다.',
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
    label: 'label',
    indicator: 'required',
    badge: 'AI 생성',
    action: { label: 'AI로 초안 쓰기', icon: 'ai' },
    placeholder: '플레이스홀더',
    description: DESCRIPTION,
    showDescription: true,
    error: ERROR,
    counter: `0 / ${MAX}자`,
    disabled: false,
  },
  argTypes: {
    status: { control: 'inline-radio', options: TEXT_AREA_FIELD_STATUSES },
    label: { control: 'text' },
    indicator: { control: 'inline-radio', options: [undefined, ...INDICATOR_TYPES] },
    badge: { control: 'text' },
    action: { control: false },
    description: { control: 'text' },
    showDescription: { control: 'boolean' },
    error: { control: 'text' },
    counter: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls에서 status와 켜고 끄는 항목(indicator·badge·showDescription)을 바꿔 보세요 */
export const Playground: Story = {};

/** Figma variant 3종: default · error · over-limit */
export const Statuses: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 40 }}>
      {TEXT_AREA_FIELD_STATUSES.map((status) => (
        <TextAreaField key={status} {...args} status={status} />
      ))}
    </div>
  ),
};

/** 헤더 옵션과 안내 문구를 끈 최소 형태. 글자 수는 남아요 */
export const Minimal: Story = {
  args: { indicator: undefined, badge: undefined, action: undefined, showDescription: false },
};

/**
 * 실제 사용 예시
 * - 글자 수를 세고, 300자를 넘으면 over-limit
 * - 비운 채로 포커스를 빼면 error
 * - "AI로 초안 쓰기"로 채우면 AI 뱃지가 켜지고, 사용자가 직접 고치면 꺼져요
 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const [value, setValue] = useState('');
    const [touched, setTouched] = useState(false);
    const [fromAi, setFromAi] = useState(false);

    const status: TextAreaFieldStatus =
      value.length > MAX ? 'over-limit' : touched && value.trim() === '' ? 'error' : 'default';

    return (
      <TextAreaField
        {...args}
        status={status}
        badge={fromAi ? 'AI 생성' : undefined}
        error={status === 'over-limit' ? `${MAX}자 이내로 입력해 주세요.` : ERROR}
        counter={`${value.length} / ${MAX}자`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setFromAi(false);
        }}
        onBlur={() => setTouched(true)}
        action={{
          label: 'AI로 초안 쓰기',
          icon: 'ai',
          onClick: () => {
            setValue('이번 주 회의에서 홈 화면 캘린더 디자인을 확정했고, 문서 편집은 서식 편집까지만 지원하기로 했다.');
            setFromAi(true);
            setTouched(true);
          },
        }}
      />
    );
  },
};
