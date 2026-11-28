import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge/Badge';
import { FilterButton } from '../FilterButton/FilterButton';
import {
  DropdownMenu,
  MenuCheckboxItem,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
} from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: DropdownMenu,
  subcomponents: { MenuItem, MenuRadioGroup, MenuRadioItem, MenuCheckboxItem },
  args: { trigger: <button />, children: null },
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 텍스트만 · 한 개 고르기 (시간 선택 · 정렬 등). 고른 항목엔 배경 + check */
export const TextOnly: Story = {
  render: () => {
    const [value, setValue] = useState('6h');
    const labels: Record<string, string> = { '3h': '3시간', '6h': '6시간', '12h': '12시간', '1d': '하루' };
    return (
      <DropdownMenu trigger={<FilterButton>{labels[value]}</FilterButton>}>
        <MenuRadioGroup value={value} onValueChange={setValue}>
          {Object.entries(labels).map(([v, label]) => (
            <MenuRadioItem key={v} value={v} label={label} />
          ))}
        </MenuRadioGroup>
      </DropdownMenu>
    );
  },
};

/** 아이콘 + 설명 (우선순위 · 마일스톤). trailing에 Badge, footer에 안내 */
export const WithDescription: Story = {
  render: () => {
    const [value, setValue] = useState('m2');
    return (
      <DropdownMenu
        trigger={<FilterButton>마일스톤</FilterButton>}
        sectionTitle="AI 추천"
        footer="마일스톤 기간 안에 마감이 있는 태스크만 보여요"
      >
        <MenuRadioGroup value={value} onValueChange={setValue}>
          <MenuRadioItem value="m1" label="기획" description="11/2 – 11/8" />
          <MenuRadioItem
            value="m2"
            label="디자인"
            description="11/9 – 11/20"
            trailing={<Badge type="ai">추천</Badge>}
          />
          <MenuRadioItem value="m3" label="개발" description="11/21 – 12/5" />
          <MenuRadioItem value="m4" label="배포" description="12/6 – 12/10" disabled />
        </MenuRadioGroup>
      </DropdownMenu>
    );
  },
};

/** 여러 개 고르기 (프로젝트·상태 필터). leading에 check-square, 골라도 메뉴가 닫히지 않아요 */
export const MultiSelect: Story = {
  render: () => {
    const projects = [
      { id: 'all', label: '전체', count: 7 },
      { id: 'midu', label: 'MIDU', count: 4 },
      { id: 'jol', label: '졸준위', count: 1 },
      { id: 'cap', label: '캡스톤', count: 2 },
    ];
    const [checked, setChecked] = useState<Record<string, boolean>>({ all: true, midu: true, jol: true });
    return (
      <DropdownMenu trigger={<FilterButton>프로젝트 전체</FilterButton>} footer="여러 개를 고를 수 있어요">
        {projects.map((p) => (
          <MenuCheckboxItem
            key={p.id}
            label={p.label}
            meta={p.count}
            checked={!!checked[p.id]}
            onCheckedChange={(next) => setChecked((prev) => ({ ...prev, [p.id]: next }))}
          />
        ))}
      </DropdownMenu>
    );
  },
};

/** 누르면 동작하는 메뉴 (선택 상태 없음) */
export const Actions: Story = {
  render: () => (
    <DropdownMenu trigger={<FilterButton>더보기</FilterButton>}>
      <MenuItem label="이름 바꾸기" onSelect={() => {}} />
      <MenuItem label="복제" meta="⌘D" onSelect={() => {}} />
      <MenuItem label="보관" disabled />
    </DropdownMenu>
  ),
};
