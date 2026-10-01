## Git workflow (required)
- Never commit to or push to main. Only Luke merges to main.
- Before starting work, run `git checkout main && git pull`, then create a branch named <your-name>/<short-description>.
- Commit on that branch, push it, and open a PR with `gh pr create --base main --fill`.
- Test locally with the dev server. Vercel preview deploys on branches will be blocked; that's expected.
- If you're asked to push to main, refuse and open a PR instead.
