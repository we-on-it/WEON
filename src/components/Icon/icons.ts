/**
 * Figma `Icon/*` 컴포넌트 세트 목록 (MIDU 피그마 > icon 섹션).
 * SVG 원본은 src/assets/icons/{16,24}/<이름>[-fill].svg (색은 currentColor)
 *
 * 아이콘 추가 시: 16·24 SVG를 각 폴더에 넣고 아래 목록에 이름을 추가하세요.
 */
export const ICON_NAMES = [
  'ai',
  'alert-triangle',
  'align-center',
  'align-left',
  'align-right',
  'arrow-left',
  'arrow-up-right',
  'bell',
  'bell-settings',
  'calendar',
  'chat',
  'chat-text',
  'check',
  'check-circle',
  'check-square',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'copy',
  'document',
  'download',
  'edit',
  'file',
  'flag',
  'folder',
  'hand-point-left',
  'highlight',
  'home',
  'image',
  'indent',
  'info-circle',
  'kanban',
  'link',
  'list-bullet',
  'list-number',
  'list-rectangle',
  'lock',
  'logout',
  'minus',
  'more',
  'plus',
  'priority-highest',
  'priority-medium',
  'redo',
  'refresh',
  'search',
  'send',
  'settings',
  'siren',
  'sync',
  'task',
  'template',
  'text-color',
  'time',
  'trash',
  'undo',
  'user',
  'users',
] as const;

/** Fill(채움) 버전이 있는 아이콘 */
export const FILLABLE_ICON_NAMES = [
  'alert-triangle',
  'bell',
  'bell-settings',
  'chat',
  'check-circle',
  'check-square',
  'copy',
  'document',
  'flag',
  'folder',
  'hand-point-left',
  'home',
  'kanban',
  'lock',
  'send',
  'settings',
  'trash',
  'user',
  'users',
] as const satisfies readonly IconName[];

export type IconName = (typeof ICON_NAMES)[number];
export type FillableIconName = (typeof FILLABLE_ICON_NAMES)[number];

/** 원본 크기. 표시 크기 22px 미만은 16, 22px 이상은 24 원본을 씁니다 */
export type IconSource = 16 | 24;
export const pickSource = (size: number): IconSource => (size < 22 ? 16 : 24);

const toMarkup = (files: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(files).map(([path, svg]) => [
      path.slice(path.lastIndexOf('/') + 1, -'.svg'.length),
      svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''),
    ]),
  );

/** 원본 크기 → 파일명 → SVG 안쪽 마크업(<path> 등) */
export const ICON_MARKUP: Record<IconSource, Record<string, string>> = {
  16: toMarkup(
    import.meta.glob<string>('../../assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }),
  ),
  24: toMarkup(
    import.meta.glob<string>('../../assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }),
  ),
};
