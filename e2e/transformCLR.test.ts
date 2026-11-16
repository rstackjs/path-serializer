import path from 'node:path';
import { expect, test } from 'rstack/test';
import { createSnapshotSerializer } from 'path-serializer';

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: path.resolve(__dirname, '..'),
  }),
);

test('should transform the color', () => {
  const input = '\u001b[1mBold Text\u001b[0m';
  expect(input).toMatchInlineSnapshot(`"<CLR=BOLD>Bold Text<CLR=0>"`);
});

test('bad case 1', () => {
  const input = 'static/react.svg'; // bad case: 'static/reactXsvg'
  expect(input).toMatchInlineSnapshot(`"static/react.svg"`);
});

test('should preserve counts while normalizing seconds with default options', () => {
  const serializer = createSnapshotSerializer();
  expect(
    serializer.serialize('Found 3 sources in 2 steps; built in 1.5s'),
  ).toBe('"Found 3 sources in 2 steps; built in Xs"');
  expect(serializer.serialize('version 2 support')).toBe('"version 2 support"');
});
