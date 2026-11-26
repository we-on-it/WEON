# WEON — AI 에이전트 작업 규칙

Claude Code·Codex 등 모든 AI 에이전트가 지킨다. (Claude Code는 `CLAUDE.md`를 통해 이 파일을 읽는다.)

커밋·브랜치 규칙의 원본은 [README.md](README.md)의 "커밋 규칙"·"브랜치 구조" 섹션이다. 작업 전에 읽고 그대로 따른다.

아래는 에이전트가 작업할 때 추가로 지킬 것:

- 파일을 고치기 전에 현재 브랜치를 확인한다. `main`이면 최신 `main`에서 README 규칙대로 작업 브랜치를 먼저 만든다.
- 이미 작업 브랜치에 있는데 관련 없는 새 작업을 요청받으면, `main`에서 새 브랜치를 따도 되는지 사용자에게 먼저 묻는다.
- `git push`는 하지 않는다 (Claude는 `.claude/settings.json`, Codex는 `.codex/rules/`에서 차단됨). 작업이 끝나면 커밋까지만 하고, 사용자에게 push → `main`으로 PR → 리뷰 후 merge를 직접 하라고 안내한다.
