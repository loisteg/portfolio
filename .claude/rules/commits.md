# Git and Commit Rules

- Never commit automatically. Before every commit, show `git status` and the relevant `git diff`,
  then wait for explicit user approval.
- Never stage unrelated user changes. Stage exact file paths, not `git add .` or `git add -A`.
- Keep commits atomic and leave the tree in a working state.
- Use Conventional Commits when the repository adopts no stricter convention:
  `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- Write an imperative, specific subject; explain non-obvious motivation in the body.
- Do not bypass hooks or weaken lint/type checks to make a commit pass.
- Never force-push, rewrite shared history, or commit secrets and `.env` files.
- Do not discard, reset, or overwrite changes that were not created for the current task.
