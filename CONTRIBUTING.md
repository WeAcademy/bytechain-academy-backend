# Contributing to ByteChain Academy Backend

Thank you for your interest in contributing! This guide covers the basics.

## Getting Started

1. **Fork and clone** the repository.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Copy environment config**:
   ```bash
   cp .env.example .env
   ```
4. **Start the dev server**:
   ```bash
   npm run start:dev
   ```

## Development Workflow

### Before opening a PR

Run all checks locally:

```bash
npm run lint        # ESLint (non-mutating)
npm run test        # Jest unit tests
npm run test:e2e    # Jest e2e tests
npm run build       # NestJS production build
```

### Branch naming

- `feat/<issue-number>-short-name` — new features
- `fix/<issue-number>-short-name` — bug fixes
- `chore/<issue-number>-short-name` — maintenance tasks

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add refresh token rotation
fix(courses): handle missing prerequisite
chore: update dependencies
```

Reference the issue with `Closes #<number>` in the PR description.

### Pull requests

- One issue per PR.
- Fill in the PR template fully.
- All CI checks must pass before review.
- Request a review from a maintainer.

## Code style

- TypeScript strict mode.
- Use the existing ESLint and Prettier configuration.
- No `any` types unless absolutely necessary — document why if used.

## Reporting issues

Use the issue templates (bug report or feature request). Include:
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.
