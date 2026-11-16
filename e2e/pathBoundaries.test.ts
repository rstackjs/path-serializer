import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from 'rstack/test';
import { createSnapshotSerializer } from 'path-serializer';

const root = path.resolve('/serializer/project');
const workspace = path.join(root, 'packages', 'core');
const serializer = createSnapshotSerializer({
  root,
  workspace,
  features: {
    addDoubleQuotes: false,
    escapeDoubleQuotes: false,
  },
});

const toPosix = (value: string) =>
  value.replace(/\\/g, '/').replace(/^([A-Z]):/i, (_, drive: string) => {
    return `/${drive.toLowerCase()}`;
  });

test.each(['-old', '.old', '2', '_old', '+old', '@old', '中文'])(
  'should preserve sibling path names ending in %s',
  (suffix) => {
    const rootSibling = `${root}${suffix}`;
    const workspaceSibling = `${workspace}${suffix}`;

    expect(serializer.serialize(rootSibling)).toBe(toPosix(rootSibling));
    expect(serializer.serialize(path.join(rootSibling, 'src/a.ts'))).toBe(
      `${toPosix(rootSibling)}/src/a.ts`,
    );
    expect(serializer.serialize(workspaceSibling)).toBe(
      `<ROOT>/packages/core${suffix}`,
    );
    expect(serializer.serialize(path.join(workspaceSibling, 'src/a.ts'))).toBe(
      `<ROOT>/packages/core${suffix}/src/a.ts`,
    );

    const rootSiblingURL = pathToFileURL(rootSibling).toString();
    const workspaceSiblingURL = pathToFileURL(workspaceSibling).toString();
    expect(serializer.serialize(rootSiblingURL)).toBe(rootSiblingURL);
    expect(serializer.serialize(`${rootSiblingURL}/src/a.ts`)).toBe(
      `${rootSiblingURL}/src/a.ts`,
    );
    expect(serializer.serialize(workspaceSiblingURL)).toBe(
      `<ROOT>/packages/core${encodeURI(suffix)}`,
    );
    expect(serializer.serialize(`${workspaceSiblingURL}/src/a.ts`)).toBe(
      `<ROOT>/packages/core${encodeURI(suffix)}/src/a.ts`,
    );
  },
);

test.each([
  [root, '<ROOT>'],
  [workspace, '<WORKSPACE>'],
  [pathToFileURL(root).toString(), '<ROOT>'],
  [pathToFileURL(workspace).toString(), '<WORKSPACE>'],
])('should replace complete paths and descendants of %s', (input, mark) => {
  expect(serializer.serialize(input)).toBe(mark);
  expect(serializer.serialize(`${input}/src/a.ts`)).toBe(`${mark}/src/a.ts`);
  expect(serializer.serialize(`'${input}' "${input}"`)).toBe(
    `'${mark}' "${mark}"`,
  );
  expect(serializer.serialize(`(${input}:12:3)`)).toBe(`(${mark}:12:3)`);
  expect(serializer.serialize(`[${input}]`)).toBe(`[${mark}]`);
  expect(serializer.serialize(`\u001b[32m${input}\u001b[39m`)).toBe(
    `<CLR=32>${mark}<CLR=39>`,
  );
  expect(serializer.serialize(`${input}\n${input} next`)).toBe(
    `${mark}\n${mark} next`,
  );
});

test('should match escaped paths and file URLs with a trailing separator', () => {
  const directory = path.join(root, 'my project[app]');
  const directorySerializer = createSnapshotSerializer({
    root: `${directory}${path.sep}`,
    features: { addDoubleQuotes: false },
  });
  const input = path.join(directory, 'src/a.ts');
  expect(directorySerializer.serialize(input)).toBe('<ROOT>src/a.ts');
  expect(directorySerializer.serialize(pathToFileURL(input).toString())).toBe(
    '<ROOT>src/a.ts',
  );
});
