# path-serializer

[![npm latest version](https://img.shields.io/npm/v/path-serializer?style=flat-square&color=98c379)](https://www.npmjs.com/package/path-serializer)

A snapshot serializer that normalizes system-specific paths into stable, readable placeholders — designed for Vitest, Jest, and Rstest.

- Stabilize pnpm dependencies path in snapshot
- Transform win32 path to posix path
- Replace absolute paths with placeholders (`<ROOT>`, `<WORKSPACE>`, `<HOME>`, `<TEMP>`)
- Handle `file://` protocol URLs
- Escape EOL (`\r\n` -> `\n`)
- Normalize ANSI color codes

```ts
// __snapshots__/index.test.ts.snap

// 😭 Without path-serializer — fragile, platform-specific, unreadable
{
  "loader" : "D:\\user\\rspack\\node_modules\\.pnpm\\css-loader@6.11.0_@rspack+core@packages+rspack_webpack@5.94.0_@swc+core@1.4.0_@swc+helpers@0._jlcdgjlw2ezzhg43ml3d627wdu\\node_modules\\css-loader\\utils.ts"
}

// 😎 With path-serializer — stable, cross-platform, clean
{
  "loader" : "<ROOT>/node_modules/<PNPM_INNER>/css-loader/utils.ts"
}
```

## Installation

```bash
# npm
npm install path-serializer -D

# pnpm
pnpm add path-serializer -D
```

## Usage

### Basic

```typescript
// vitest.setup.ts
import path from 'node:path';
import { createSnapshotSerializer } from 'path-serializer';

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: path.join(__dirname, '..'),
  }),
);
```

### With Workspace (Monorepo)

```typescript
expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: path.join(__dirname, '../..'),
    workspace: path.join(__dirname, '..'),
  }),
);
```

This replaces:
- Workspace paths → `<WORKSPACE>/...`
- Root paths → `<ROOT>/...`

### Custom Replacements

Use `replace` and `replacePost` to add custom path matchers:

```typescript
expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: path.join(__dirname, '..'),
    replace: [
      { match: /port\s\d+/, mark: 'PORT' },
      { match: '/specific/path', mark: '<CUSTOM>' },
    ],
  }),
);
```

### Hooks

Use `beforeSerialize` and `afterSerialize` for custom pre/post processing:

```typescript
expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: path.join(__dirname, '..'),
    beforeSerialize: (val) => val.replace(/hash:\w{8}/g, 'hash:<HASH>'),
    afterSerialize: (val) => val.trim(),
  }),
);
```

## Options

### `root`

- **Type:** `string`
- **Default:** `process.cwd()`

Repository root path. Paths under this directory are replaced with `<ROOT>`.

### `workspace`

- **Type:** `string`
- **Default:** `''`

Workspace root path (for monorepos). Paths under this directory are replaced with `<WORKSPACE>`.

### `replace`

- **Type:** `PathMatcher[]`

Custom matchers applied **before** built-in replacements.

### `replacePost`

- **Type:** `PathMatcher[]`

Custom matchers applied **after** built-in replacements.

### `beforeSerialize`

- **Type:** `(val: string) => string`

Transform the raw string before any replacements.

### `afterSerialize`

- **Type:** `(val: string) => string`

Transform the final string after all replacements.

### `features`

Toggle individual features (all enabled by default):

| Feature | Default | Description |
|---|---|---|
| `replaceWorkspace` | `true` | `/foo/packages/core/src` → `<WORKSPACE>/src` |
| `replaceRoot` | `true` | `/foo/node_modules/.pnpm` → `<ROOT>/node_modules/.pnpm` |
| `replaceWorkspaceWithFileProtocol` | `true` | `file:///foo/packages/core/src` → `<WORKSPACE>/src` |
| `replaceRootWithFileProtocol` | `true` | `file:///foo/node_modules/.pnpm` → `<ROOT>/node_modules/.pnpm` |
| `replacePnpmInner` | `true` | Collapse pnpm's long `.pnpm/...` paths to `<PNPM_INNER>` |
| `replaceTmpDir` | `true` | `os.tmpdir()` paths → `<TEMP>` |
| `replaceHomeDir` | `true` | `os.homedir()` paths → `<HOME>` |
| `transformWin32Path` | `true` | Convert `D:\\foo\\bar` to `/d/foo/bar` |
| `transformCLR` | `true` | Normalize ANSI color escape codes |
| `escapeDoubleQuotes` | `true` | Escape `"` to `\"` |
| `escapeEOL` | `true` | Normalize `\r\n` to `\n` |
| `addDoubleQuotes` | `true` | Wrap output in double quotes |

## Showcases

- [Rslib](https://github.com/web-infra-dev/rslib/blob/3ff6859eb38171c731e447a1364afc021f8c501a/tests/setupVitestTests.ts)
- [Rsbuild](https://github.com/web-infra-dev/rsbuild/blob/a50eafa3519caaa66ecd6b0ccb2897a8194781ff/scripts/test-helper/vitest.setup.ts)
- [Rspack](https://github.com/web-infra-dev/rspack/blob/5a6162c/packages/rspack-test-tools/src/helper/expect/placeholder.ts)
- [Rspress](https://github.com/web-infra-dev/rspress/blob/8d620050cc2590954838e201d39c10744b6d1bac/scripts/test-helper/rstest.setup.ts)

## License

[MIT](./LICENSE)
