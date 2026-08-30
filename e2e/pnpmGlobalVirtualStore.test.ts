import { expect, test } from '@rstest/core';
import { createSnapshotSerializer } from 'path-serializer';

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: '/Users/user/project',
  }),
);

test('should serialize pnpm global virtual store path (posix)', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/react/19.2.4/5c6e83be0e5f1f15e83462f0b7655d9d9338d33338bad7cc29bc12f2daa11aa3/node_modules/react/index.js';

  expect(filePath).toMatchInlineSnapshot(`"<PNPM_INNER>/react/index.js"`);
});

test('should serialize pnpm global virtual store path with cjs (posix)', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/react/19.2.4/5c6e83be0e5f1f15e83462f0b7655d9d9338d33338bad7cc29bc12f2daa11aa3/node_modules/react/cjs/react.production.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<PNPM_INNER>/react/cjs/react.production.js"`,
  );
});

test('should serialize pnpm global virtual store path with scoped package', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/@babel/core/7.25.0/abc123def456/node_modules/@babel/core/lib/index.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<PNPM_INNER>/@babel/core/lib/index.js"`,
  );
});

test('should serialize pnpm global virtual store path with custom store dir (posix)', () => {
  const filePath =
    '/Users/runner/setup-pnpm/node_modules/.bin/store/v11/links/@/babel-loader/10.1.1/2e0a48b2c431adf706e0ceeb7230f336ebd327dd1253fa61217daa3dbb5c78dc/node_modules/babel-loader/lib/index.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<PNPM_INNER>/babel-loader/lib/index.js"`,
  );
});

test('should serialize pnpm global virtual store path (win32)', () => {
  const serializer = createSnapshotSerializer({
    root: 'D:\\user\\project',
    features: {
      transformWin32Path: true,
    },
  });

  const filePath =
    'D:\\user\\project\\node_modules\\..\\..\\..\\..\\..\\..\\Library\\pnpm\\store\\v10\\links\\react\\19.2.4\\5c6e83be0e5f1f15e83462f0b7655d9d9338d33338bad7cc29bc12f2daa11aa3\\node_modules\\react\\index.js';

  expect(serializer.serialize(filePath)).toMatchInlineSnapshot(
    `"\\"<PNPM_INNER>/react/index.js\\""`,
  );
});

test('should serialize pnpm global virtual store path with custom store dir (win32)', () => {
  const serializer = createSnapshotSerializer({
    features: {
      transformWin32Path: true,
    },
  });

  const filePath =
    'D:\\.pnpm-store\\v11\\links\\@tailwindcss\\webpack\\4.3.3\\ec899805fefbf1ad652f8b65ed5d2e0d6fffbd615e2734cb7010eb00a7c4b15d\\node_modules\\@tailwindcss\\webpack\\dist\\index.js';

  expect(serializer.serialize(filePath)).toMatchInlineSnapshot(
    `"\\"<PNPM_INNER>/@tailwindcss/webpack/dist/index.js\\""`,
  );
});
