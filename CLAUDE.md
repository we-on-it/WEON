# WEON — Claude 작업 규칙

팀원 모두가 Claude Code로 작업합니다. 아래 규칙은 누가 시키든 항상 지킵니다.

## 브랜치

- `main`에는 직접 커밋하지 않는다. 파일을 고치기 전에 현재 브랜치를 확인하고, `main`이면 작업 브랜치를 먼저 만든다.
  ```bash
  git switch main && git pull
  git switch -c <타입>/<작업명>
  ```
- 브랜치 이름: `<타입>/<작업명>`
  - `<타입>`: 커밋 타입과 같음 — `feat` `fix` `docs` `style` `design` `refactor` `chore`
  - `<작업명>`: 영어 소문자, 단어는 `-`로 연결, 짧게 (예: `feat/login-page`, `design/button-hover`, `fix/mobile-menu`)
- 작업 하나 = 브랜치 하나. 이미 작업 브랜치에 있는데 관련 없는 새 작업을 요청받으면, `main`에서 새 브랜치를 따도 되는지 사용자에게 먼저 묻는다.
- 개인 이름 브랜치(`jieun`, `minji` 등)나 `develop`은 만들지 않는다.
- 작업이 끝나면 push하고 `main`으로 PR을 연다. merge는 사용자가 리뷰 후 직접 한다.
- merge된 브랜치는 삭제한다.

## 커밋

```
<타입>: <요약>
```

- 타입은 위 브랜치 타입과 같다 (`feat` 새 기능, `fix` 버그 수정, `docs` 문서, `style` 포맷, `design` UI/CSS, `refactor` 구조 개선, `chore` 설정·빌드·배포)
- 요약은 한국어, 50자 이내, 마침표 없음
- 한 커밋에는 한 가지 작업만

자세한 설명과 예시는 [README.md](README.md)의 "커밋 규칙"·"브랜치 구조" 섹션을 따른다.
