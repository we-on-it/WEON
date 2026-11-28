import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Popup } from './Popup';

const meta = {
  title: 'Components/Popup',
  component: Popup,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    onClose: fn(),
    title: 'Popup Title',
    closeOnDimClick: true,
  },
  argTypes: {
    title: { control: 'text' },
    closeOnDimClick: { control: 'boolean' },
    open: { control: 'boolean' },
  },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 560,
      borderRadius: 16,
      background: 'var(--background-floated-subtle)',
      color: 'var(--foreground-tertiary)',
    }}
  >
    콘텐츠 영역
  </div>
);

const actions = (
  <>
    <Button variant="neutral-weak">라벨</Button>
    <Button variant="neutral-solid">라벨</Button>
  </>
);

/** Figma 기본형: 제목 + 콘텐츠 + 액션 영역. 항상 dim과 함께 떠요 */
export const Default: Story = {
  args: { children: placeholder, actions },
};

/** Figma `actionArea` off */
export const WithoutActions: Story = {
  args: { children: placeholder },
};

/** Figma `popupTitle` off */
export const WithoutTitle: Story = {
  args: { title: undefined, children: placeholder, actions },
};

/** 내용이 길면 콘텐츠만 스크롤되고, 액션 영역은 그라디언트와 함께 아래에 고정돼요 */
export const LongContent: Story = {
  args: {
    actions,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>
            {i + 1}번째 줄 — 스크롤을 내려 액션 영역 그라디언트를 확인하세요.
          </p>
        ))}
      </div>
    ),
  },
};

/** 실제 사용 예: 버튼으로 열고 닫기, Esc · dim 클릭으로도 닫혀요 */
export const Interactive: Story = {
  args: { open: false },
  parameters: { layout: 'centered', controls: { include: ['title', 'closeOnDimClick'] } },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>팝업 열기</Button>
        <Popup
          {...args}
          open={open}
          onClose={close}
          actions={
            <>
              <Button variant="neutral-weak" onClick={close}>
                취소
              </Button>
              <Button variant="neutral-solid" onClick={close}>
                확인
              </Button>
            </>
          }
        >
          {placeholder}
        </Popup>
      </>
    );
  },
};
