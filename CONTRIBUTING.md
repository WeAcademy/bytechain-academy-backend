# Contributing to the ByteChain Academy backend

Thank you for helping improve ByteChain Academy. This repository is the NestJS
REST API for the platform.

## Before you start

1. Pick an open issue and read its scope, acceptance criteria, and checklist.
2. Comment with a short plan (problem, approach, ETA) and wait for a
   maintainer to assign the issue before opening a pull request.
3. Keep each PR focused on a single issue.

## Local setup

```bash
npm ci
cp .env.example .env
npm run start:dev
```

The API listens on `http://localhost:3001` by default.

## Useful scripts

| Command | What it does |
|---|---|
| `npm run start:dev` | Run the API in watch mode |
| `npm run build` | Compile the NestJS application |
| `npm run lint` | Lint `src` and `test` |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run seed:currencies` | Seed the currency catalogue |

## Branch and commit conventions

- Branch: `feat/<short-description>`, `fix/<short-description>`,
  `ci/<short-description>`, `docs/<short-description>`.
- Commits: conventional style, for example `feat(auth): add refresh endpoint`.
- Reference the issue in the PR body with `Closes #<number>`.

## Pull requests

- Explain what changed and why.
- Include the commands you ran and their results.
- Add or update tests for behaviour changes.
- Update the README when configuration or scripts change.
- Never commit secrets, `.env` files, database dumps, or generated output.
- Keep the change within the issue's scope; open a separate issue for anything
  else you notice.

## Code style

The project uses ESLint and Prettier. Run `npm run lint` and `npm run format`
before pushing. Prefer typed DTOs, constructor injection, and services that keep
controllers thin.

## Reporting security issues

Do not open a public issue for a vulnerability. Email contact@nexacore.org
instead.
