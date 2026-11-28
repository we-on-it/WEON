import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DocumentEditor } from './DocumentEditor';

const SAMPLE = `
<h1>MIDU 3주차 회의록</h1>
<p><b>일시</b> 2026년 11월 11일 18:00 · <b>참석</b> 한서윤, 박지유, 이하린, 최수아</p>
<h2>논의 내용</h2>
<ul>
  <li><p>홈 화면 캘린더 디자인 <mark data-color="var(--fill-brand-weak)" style="background-color: var(--fill-brand-weak)">최종 확정</mark></p></li>
  <li><p>문서 편집 기능은 <span style="color: var(--foreground-critical)">서식 편집까지만</span> 지원</p></li>
</ul>
<h2>할 일</h2>
<ol>
  <li><p>에디터 UI 스토리북 등록</p></li>
  <li><p>참고 자료: <a href="https://tiptap.dev">Tiptap 문서</a></p></li>
</ol>
`;

const meta = {
  title: 'Components/DocumentEditor',
  component: DocumentEditor,
  args: {
    content: SAMPLE,
    editable: true,
    placeholder: '내용을 입력하세요',
  },
  argTypes: {
    editable: { control: 'boolean' },
    content: { control: false },
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 예시 문서가 들어 있는 기본 상태. 툴바 버튼을 눌러 서식을 바꿔 보세요 */
export const Playground: Story = {};

/** 빈 문서 (안내 문구 표시) */
export const Empty: Story = {
  args: { content: '' },
};

/** 읽기 전용. 툴바가 숨겨지고 편집할 수 없어요 */
export const ReadOnly: Story = {
  args: { editable: false },
};

/** onChange로 받은 HTML이 아래에 실시간으로 보여요. 저장 기능은 이 값을 서버로 보내면 됩니다 */
export const WithHtmlOutput: Story = {
  render: (args) => {
    const [html, setHtml] = useState(args.content ?? '');
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <DocumentEditor {...args} onChange={setHtml} />
        <pre
          style={{
            margin: 0,
            padding: 12,
            maxHeight: 200,
            overflow: 'auto',
            borderRadius: 8,
            background: 'var(--fill-neutral-weak)',
            fontSize: 12,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {html}
        </pre>
      </div>
    );
  },
};
