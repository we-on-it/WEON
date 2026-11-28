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
main                  ← 배포 브랜치 (직접 커밋 X)
 ├ feat/button        ← 작업 단위 브랜치
 ├ design/color-token
 └ fix/mobile-menu
```

| 브랜치 | 역할 |
|---|---|
| `main` | 배포되는 코드. 작업 브랜치에서 PR로만 합침 |
| `<타입>/<작업명>` | 작업 하나당 브랜치 하나. `main`에서 따고, 끝나면 `main`으로 PR |

- `<타입>`은 커밋 타입과 같이 씀 (`feat`, `fix`, `docs`, `style`, `design`, `refactor`, `chore`)
- `<작업명>`은 영어 소문자, 단어는 `-`로 연결 (예: `feat/login-page`)
- merge된 브랜치는 삭제

```bash
git switch main && git pull           # 1. main 최신화
git switch -c feat/login-page         # 2. 작업 브랜치 만들기
git push -u origin feat/login-page    # 3. 커밋 후 push
```

4. GitHub에서 `main`으로 PR → 리뷰 후 merge → 브랜치 삭제

## 스토리북

팀 프로젝트 홈은 `npm ci` 후 `npm run dev`를 실행하고 `/team-project-home/`에서 확인합니다.
Storybook의 `Screens/TeamProjectHome`에는 실제 데모 데이터 화면과 Figma 비교용 화면, 목록 보기, 빈 보드가 있습니다.

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

- 화면 작업에는 **semantic 변수**(`--background-*`, `--foreground-*`, `--fill-*`, `--border-*`)와 강조용 `--accent-*`를 쓰고, `--palette-*`는 직접 쓰지 않기
- 목록은 스토리북 `Foundations/Color`에서 확인, 클릭하면 `var(...)` 복사
### 그라디언트 · 그림자

```css
.page { background: var(--background-default); }  /* 그라디언트라 background-color 말고 background */
.card { box-shadow: var(--shadow-normal); }        /* --shadow-weak, --shadow-normal */
```

- 그림자 목록은 스토리북 `Foundations/Shadow`에서 확인

## 간격 · 모서리

```css
.card { display: flex; gap: var(--gap-8); padding: var(--padding-16); border-radius: var(--round-16); }
.chip { border-radius: var(--round-pill); }
```

- `--gap-*`, `--padding-*`, `--round-*` (숫자 = px). 목록은 `src/styles/numbers.css`

### 토큰 갱신

`src/styles/colors.css`, `src/styles/numbers.css`는 아래 JSON에서 자동 생성되는 파일이라 직접 수정하지 않습니다.

| 파일 | 내용 | 갱신 방법 |
|---|---|---|
| `src/styles/tokens/figma-variables.tokens.json` | 팔레트·semantic 색 (Figma 변수) | Figma에서 변수 export → 파일 교체 |
| `src/styles/tokens/figma-styles.tokens.json` | 그라디언트·그림자 (Figma 스타일) | 스타일은 export되지 않아 값을 직접 수정 |
| `src/styles/tokens/figma-numbers.tokens.json` | 간격·모서리 (Figma 숫자 변수) | Figma에서 변수 export → 파일 교체 |

```bash
npm run tokens   # JSON → colors.css, numbers.css 재생성
```

## 화면 폭

| 항목 | 값 | 설명 |
|---|---|---|
| 디자인 기준 | 1502px | Figma 시안 폭. 이 폭에서 시안과 똑같이 보여야 함 |
| 최소 지원 폭 | 1280px | 이보다 좁으면 레이아웃을 바꾸지 않고 가로 스크롤 |
| 확인할 높이 | 약 600px | 1280×720 노트북에서 브라우저 UI를 뺀 높이 |

- 1280px 이상에서는 고정 폭 대신 `flex`, `max-width` 등으로 폭에 맞춰 늘고 줄게 만들기
- 모바일·태블릿 레이아웃은 시안이 없으므로 만들지 않음. 미디어 쿼리는 실제로 깨지는 곳에만 추가
- 600px 높이에서 주요 버튼이 화면 밖으로 밀리지 않는지 확인

## 화면 추가 · 배포

`main`에 merge되면 GitHub Actions(`.github/workflows/pages.yml`)가 빌드해서 [weonit.kr](https://weonit.kr)에 자동 배포합니다.

| 주소 | 내용 |
|---|---|
| `/` | 안내 페이지 (루트 `index.html`) |
| `/my-tasks/`, `/team-project-home/` … | 화면별 페이지 |
| `/storybook/` | Storybook 정적 빌드 |

새 화면을 weonit.kr에 올리려면:

1. 루트에 `<경로>/index.html` + `<경로>/main.tsx` 진입점을 만든다 (`my-tasks/` 참고)
2. `vite.config.ts`의 `input`에 `'<경로>/index.html'` 추가
3. 루트 `index.html` 목록에 링크 추가

```bash
npm run build                     # dist/ 로 빌드
npx vite preview                  # http://localhost:4173 에서 배포본 확인
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
