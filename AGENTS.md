# AGENTS.md

## Stack

- Node.js via the repository CI matrix.
- pnpm for dependency management.
- Rslib builds dual ESM and CommonJS package output.
- Rstest runs unit and package behavior tests.
- Rslint and Prettier handle linting and formatting.

## Commands

```bash
# setup
corepack enable && pnpm install

# checks
pnpm lint
pnpm test

# build / package validation
pnpm run build
npm pack --dry-run
```

## Project Structure

```text
src/      # package source and unit tests
e2e/      # package behavior tests
dist/     # generated build output
```

## Code Style

- Use single quotes and existing Prettier conventions.
- Keep TypeScript strict-safe; avoid `any`.
- Naming: camelCase for functions/files and PascalCase for types/classes.
