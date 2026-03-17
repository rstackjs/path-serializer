import { createSnapshotSerializer } from 'path-serializer';
import { expect, test } from 'vitest';

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: '/Users/user/project',
  }),
);

test('should serialize pnpm global virtual store path (posix)', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/react/19.2.4/5c6e83be0e5f1f15e83462f0b7655d9d9338d33338bad7cc29bc12f2daa11aa3/node_modules/react/index.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<ROOT>/node_modules/../../../../../../Library/<PNPM_INNER>/react/index.js"`,
  );
});

test('should serialize pnpm global virtual store path with cjs (posix)', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/react/19.2.4/5c6e83be0e5f1f15e83462f0b7655d9d9338d33338bad7cc29bc12f2daa11aa3/node_modules/react/cjs/react.production.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<ROOT>/node_modules/../../../../../../Library/<PNPM_INNER>/react/cjs/react.production.js"`,
  );
});

test('should serialize pnpm global virtual store path with scoped package', () => {
  const filePath =
    '/Users/user/project/node_modules/../../../../../../Library/pnpm/store/v10/links/@babel/core/7.25.0/abc123def456/node_modules/@babel/core/lib/index.js';

  expect(filePath).toMatchInlineSnapshot(
    `"<ROOT>/node_modules/../../../../../../Library/<PNPM_INNER>/@babel/core/lib/index.js"`,
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
    `"\\"../../Library/<PNPM_INNER>/react/index.js\\""`,
  );
});
