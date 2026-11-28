# WEON — AI 에이전트 작업 규칙

Claude Code·Codex 등 모든 AI 에이전트가 지킨다. (Claude Code는 `CLAUDE.md`를 통해 이 파일을 읽는다.)

커밋·브랜치 규칙의 원본은 [README.md](README.md)의 "커밋 규칙"·"브랜치 구조" 섹션이다. 작업 전에 읽고 그대로 따른다.

아래는 에이전트가 작업할 때 추가로 지킬 것:

- 파일을 고치기 전에 현재 브랜치를 확인한다. `main`이면 최신 `main`에서 README 규칙대로 작업 브랜치를 먼저 만든다.
- 이미 작업 브랜치에 있는데 관련 없는 새 작업을 요청받으면, `main`에서 새 브랜치를 따도 되는지 사용자에게 먼저 묻는다.
- 작업 중에는 커밋만 하고, 커밋할 때마다 push하지 않는다.
- 작업이 끝나면 사용자에게 "push하고 PR 열까요?"라고 묻고, 승인받으면 push와 PR 생성을 한 번에 한다.
  ```bash
  git push -u origin <브랜치>
  gh pr create --base main --fill
  ```
  - push는 실행 전에 승인 창이 뜬다 (Claude는 `.claude/settings.json`, Codex는 `.codex/rules/`).
  - `gh`가 없거나 로그인되어 있지 않으면 push까지만 하고, GitHub에서 PR을 열 수 있는 링크를 알려준다.
- merge는 하지 않는다. 사용자가 리뷰 후 직접 한다. (merge된 브랜치는 GitHub에서 자동 삭제됨)
- 화면·컴포넌트를 만들 때는 README "화면 폭" 섹션을 따른다. 디자인 기준은 1502px, 최소 지원 폭은 1280px이고, 시안에 없는 모바일·태블릿 레이아웃이나 브레이크포인트는 임의로 만들지 않는다.
- 새 화면(페이지)을 만들면 README "화면 추가 · 배포" 절차대로 진입점을 등록한다. 등록하지 않으면 weonit.kr에 올라가지 않는다.
