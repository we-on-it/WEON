import type { SVGProps } from 'react';
import { ICON_MARKUP, type FillableIconName, type IconName } from './icons';

type BaseProps = Omit<SVGProps<SVGSVGElement>, 'fill' | 'name' | 'children'> & {
  /** 16 · 24 (Figma 기준 크기). 그 외 px 값도 가능. 기본 24 */
  size?: 16 | 24 | number;
  /** 스크린리더용 이름. 없으면 장식용으로 보고 aria-hidden 처리 */
  title?: string;
};

export type IconProps = BaseProps &
  (
    | { name: FillableIconName; /** 채움 버전 */ fill?: boolean }
    | { name: Exclude<IconName, FillableIconName>; fill?: never }
  );

/**
 * Figma `Icon/*` 아이콘. 색은 `color`(currentColor)로 지정합니다.
 * 16px 버전은 24px 원본을 축소한 것과 동일하므로 24px 원본 하나로 그립니다.
 */
export function Icon({ name, fill = false, size = 24, title, ...rest }: IconProps) {
  const markup = ICON_MARKUP[fill ? `${name}-fill` : name];

  if (markup === undefined && import.meta.env.DEV) {
    console.warn(`[Icon] "${name}${fill ? '-fill' : ''}" 아이콘이 없습니다.`);
  }

  const a11y = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': true as const, focusable: 'false' as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...a11y}
      {...rest}
      dangerouslySetInnerHTML={{ __html: markup ?? '' }}
    />
  );
}

export default Icon;
