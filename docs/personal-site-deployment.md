# Personal Site Deployment

This repository deploys `main` to GitHub Pages through `.github/workflows/deploy.yml`.

## Standard commands

Run all local checks without committing or pushing:

```bash
npm run verify
```

`verify` runs typecheck, lint, and the production build. If Windows has an old `out/` export directory locked, it automatically builds an isolated temporary copy and reports that path; no repository files are deleted.

Exercise the complete deployment preflight without committing or pushing:

```bash
npm run deploy -- --dry-run
```

Verify, commit current changes with the default message, push, and wait for GitHub Actions:

```bash
npm run deploy
```

Use a specific commit message:

```bash
npm run deploy -- "Describe the website update"
```

## Safety behavior

The deployment script stops before changing Git history when:

- the current branch is not `main`;
- `origin` does not point to `Wenjie-Tang/Wenjie-Tang.github.io`;
- the configured upstream is not `origin/main`;
- the local branch is behind `origin/main`;
- typecheck, lint, or production build fails.

The script never force pushes, rebases, resets, deletes commits, or changes the Pages URL. If the upstream is missing, the first successful push configures `origin/main`. If there are no changes and no unpushed commits, it exits without creating an empty commit.

After a successful push, GitHub Actions builds `out/` and deploys it with `actions/deploy-pages`. The script waits up to three minutes for that workflow and prints its URL and result.
