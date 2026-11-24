# WEON

## 커밋 규칙

```
<타입>: <요약>
```

| 타입 | 언제 쓰나 | 예시 |
|---|---|---|
| `feat` | 새 기능 | `feat: 메인 페이지 추가` |
| `fix` | 버그 수정 | `fix: 모바일 메뉴 오류 수정` |
| `docs` | 문서 수정 | `docs: README 수정` |
| `style` | 포맷 등 동작과 무관한 수정 | `style: 들여쓰기 정리` |
| `design` | UI/CSS 변경 | `design: 버튼 색상 변경` |
| `refactor` | 동작은 같고 구조만 개선 | `refactor: 헤더 분리` |
| `chore` | 설정, 빌드, 배포 등 | `chore: 도메인 연결` |

- 요약은 한국어, 50자 이내, 마침표 없음
- 한 커밋에는 한 가지 작업만

## 브랜치 구조

```
main      ← 배포 브랜치 (직접 커밋 X)
 └ develop   ← 작업 통합 브랜치
    ├ jieun
    ├ minji
    ├ sieun
    └ yugyung   ← 개인 작업 브랜치
```

| 브랜치 | 역할 |
|---|---|
| `main` | 배포되는 코드. `develop`에서 PR로만 합침 |
| `develop` | 각자 작업을 모으는 곳. 개인 브랜치에서 PR로 합침 |
| `<이름>` | 개인 작업 브랜치. 여기서 커밋하고 `develop`으로 PR |

1. 작업 전 `develop`의 최신 내용을 내 브랜치로 가져오기 (`git pull origin develop`)
2. 내 브랜치에서 커밋 → push
3. `develop`으로 PR → 리뷰 후 merge
4. 배포할 때 `develop` → `main` PR

## 스토리북

```bash
npm install
npm run storybook        # http://localhost:6006
npm run build-storybook  # storybook-static/ 로 정적 빌드
```

- 컴포넌트는 `src/components/<이름>/` 아래에 `컴포넌트.tsx` + `컴포넌트.stories.tsx`로 둡니다
- 전역 폰트 설정은 `src/styles/global.css`, 웹폰트 링크는 `.storybook/preview-head.html`

## 컬러

```css
.button { background: var(--fill-brand); color: var(--foreground-inverted); }
.button:hover { background: var(--fill-brand-hover); }
```

- 화면 작업에는 **semantic 변수**(`--background-*`, `--foreground-*`, `--fill-*`, `--border-*`)를 쓰고, `--palette-*`는 직접 쓰지 않기
- 목록은 스토리북 `Foundations/Color`에서 확인, 클릭하면 `var(...)` 복사
### 그라디언트 · 그림자

```css
.page { background: var(--background-default); }  /* 그라디언트라 background-color 말고 background */
.card { box-shadow: var(--shadow-normal); }        /* --shadow-weak, --shadow-normal */
```

- 그림자 목록은 스토리북 `Foundations/Shadow`에서 확인

### 토큰 갱신

`src/styles/colors.css`는 아래 두 JSON에서 자동 생성되는 파일이라 직접 수정하지 않습니다.

| 파일 | 내용 | 갱신 방법 |
|---|---|---|
| `src/styles/tokens/figma-variables.tokens.json` | 팔레트·semantic 색 (Figma 변수) | Figma에서 변수 export → 파일 교체 |
| `src/styles/tokens/figma-styles.tokens.json` | 그라디언트·그림자 (Figma 스타일) | 스타일은 export되지 않아 값을 직접 수정 |

```bash
npm run tokens   # 두 JSON → colors.css 재생성
```

## 아이콘

```tsx
import { Icon } from './components/Icon/Icon';

<Icon name="bell" />                          // 24px, 기본
<Icon name="bell" size={16} fill />           // 16px, 채움 버전
<Icon name="search" style={{ color: '#2563eb' }} title="검색" />
```

- 크기 규칙: `size` 22 미만은 16px 원본, 22 이상은 24px 원본을 사용 (컴포넌트가 자동 선택)
- 색은 `color`로 지정 (SVG가 `currentColor` 사용)
- 목록은 스토리북 `Foundations/Icon > All`에서 확인, 클릭하면 이름 복사
- 추가: `src/assets/icons/16/`, `src/assets/icons/24/`에 `<이름>[-fill].svg`를 각각 넣고 `src/components/Icon/icons.ts` 목록에 이름 추가
