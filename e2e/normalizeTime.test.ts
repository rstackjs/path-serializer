import { expect, test } from 'rstack/test';
import { createSnapshotSerializer } from 'path-serializer';

test.each([
  [true, true, '<CLR=33,BOLD>X</CLR> s'],
  [true, false, '<CLR=33,BOLD>1.5</CLR> s'],
  [false, true, '\u001b[1m\u001b[33mX\u001b[39m\u001b[22m s'],
  [false, false, '\u001b[1m\u001b[33m1.5\u001b[39m\u001b[22m s'],
] as const)(
  'should independently control color (%s) and time (%s) normalization',
  (transformCLR, normalizeTime, expected) => {
    const serializer = createSnapshotSerializer({
      features: { transformCLR, normalizeTime, addDoubleQuotes: false },
    });
    expect(
      serializer.serialize('\u001b[1m\u001b[33m1.5\u001b[39m\u001b[22m s'),
    ).toBe(expected);
    expect(serializer.serialize('built in 1.5s')).toBe(
      normalizeTime ? 'built in Xs' : 'built in 1.5s',
    );
  },
);

test('should normalize time by default when color normalization is disabled', () => {
  const serializer = createSnapshotSerializer({
    features: { transformCLR: false, addDoubleQuotes: false },
  });
  expect(serializer.serialize('\u001b[33m1.5s\u001b[39m')).toBe(
    '\u001b[33mXs\u001b[39m',
  );
});

test('should preserve counts while normalizing seconds with default options', () => {
  const serializer = createSnapshotSerializer();
  expect(
    serializer.serialize('Found 3 sources in 2 steps; built in 1.5s'),
  ).toBe('"Found 3 sources in 2 steps; built in Xs"');
  expect(serializer.serialize('version 2 support')).toBe('"version 2 support"');
});
