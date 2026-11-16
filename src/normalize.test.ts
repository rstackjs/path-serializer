import { describe, expect, test } from 'rstack/test';
import {
  normalizeCLR,
  normalizeCodeToPosix,
  normalizePathToPosix,
  normalizeTime,
} from './normalize';

describe('normalizePathToPosix', () => {
  test('should serialize in windows', () => {
    const result = normalizePathToPosix('C:\\no\\dirname;');
    expect(result).toMatchInlineSnapshot(`"/c/no/dirname;"`);

    const result2 = normalizePathToPosix(
      'D:\\Users\\user\\Documents\\code\\user\\fe-dev-scripts\\src\\utils.ts',
    );
    expect(result2).toMatchInlineSnapshot(
      `"/d/Users/user/Documents/code/user/fe-dev-scripts/src/utils.ts"`,
    );

    const result3 = normalizePathToPosix(
      'D:\\a\\rsbuild\\rsbuild\\packages\\plugin-babel',
    );
    expect(result3).toMatchInlineSnapshot(
      `"/d/a/rsbuild/rsbuild/packages/plugin-babel"`,
    );

    const result4 = normalizePathToPosix(
      'D:/a/rsbuild/rsbuild/packages/compat/plugin-swc/tests',
    );
    expect(result4).toMatchInlineSnapshot(
      `"/d/a/rsbuild/rsbuild/packages/compat/plugin-swc/tests"`,
    );
  });
});

describe('normalizeCodeToPosix', () => {
  test('should serialize webpack dist', () => {
    const code = normalizeCodeToPosix(`
  ;// CONCATENATED MODULE: ../../../../node_modules/.pnpm/@swc+helpers@0.5.11/node_modules/@swc/helpers/esm/_class_private_method_get.js
function _class_private_method_get(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");

    return fn;
}
`);
    expect(code).toMatchInlineSnapshot(`
    "
      ;// CONCATENATED MODULE: ../../../../node_modules/.pnpm/@swc+helpers@0.5.11/node_modules/@swc/helpers/esm/_class_private_method_get.js
    function _class_private_method_get(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");

        return fn;
    }
    "
  `);
  });

  test('should serialize loader path', () => {
    const code = normalizeCodeToPosix(`
  {
      loader: 'D:\\Users\\user\\Documents\\code\\user\\fe-dev-scripts\\src\\utils.ts',
  }
  `);
    expect(code).toMatchInlineSnapshot(`
    "
      {
          loader: '/d/Users/user/Documents/code/user/fe-dev-scripts/src/utils.ts',
      }
      "
  `);

    const code2 = normalizeCodeToPosix(`{
    "cwd": "D:/a/rsbuild/rsbuild/packages/compat/plugin-swc/tests",
  }`);

    expect(code2).toMatchInlineSnapshot(`
    "{
        "cwd": "/d/a/rsbuild/rsbuild/packages/compat/plugin-swc/tests",
      }"
  `);
  });

  test('should serialize windows path in string', () => {
    const code = normalizeCodeToPosix(`
    {
        loader: "C:\\\\user\\\\lynx-stack\\\\app.jsx",
    }
    `);

    expect(code).toMatchInlineSnapshot(`
      "
          {
              loader: "/c/user/lynx-stack/app.jsx",
          }
          "
    `);
  });

  test('should not transform http and https', () => {
    const code = normalizeCodeToPosix(`
    {
        loader: 'http://localhost:8888',
    }
    `);
    expect(code).toMatchInlineSnapshot(`
    "
        {
            loader: 'http://localhost:8888',
        }
        "
  `);

    const code2 = normalizeCodeToPosix(`
    {
        loader: 'https://localhost:8888',
    }
    `);
    expect(code2).toMatchInlineSnapshot(`
    "
        {
            loader: 'https://localhost:8888',
        }
        "
  `);
  });
});

describe('normalizeCLR', () => {
  test('should replace bold ANSI escape sequences with <CLR=BOLD>', () => {
    const input = '\u001b[1mBold Text\u001b[0m';
    const expected = '<CLR=BOLD>Bold Text<CLR=0>';
    expect(normalizeCLR(input)).toBe(expected);
  });

  test('should preserve time values', () => {
    expect(normalizeCLR('built in 1.5s')).toBe('built in 1.5s');
    expect(normalizeCLR('\u001b[33m1.5s\u001b[39m')).toBe(
      '<CLR=33>1.5s<CLR=39>',
    );
  });
});

describe('normalizeTime', () => {
  test.each([
    ['<CLR=33,BOLD>1.5</CLR> s', '<CLR=33,BOLD>X</CLR> s'],
    ['<CLR=33>1.5<CLR=39> s', '<CLR=33>X<CLR=39> s'],
    ['\u001b[33m1.5\u001b[39m s', '\u001b[33mX\u001b[39m s'],
    ['built in 1500 ms', 'built in 1500 ms'],
    ['received 3 msgs', 'received 3 msgs'],
  ])('should preserve units and color markers in %s', (input, expected) => {
    expect(normalizeTime(input)).toBe(expected);
  });

  test('should replace time values with "X" followed by time unit', () => {
    const testCases = [
      {
        input: '1.234s',
        expected: 'Xs',
      },
      {
        input: '0.001s',
        expected: 'Xs',
      },
      {
        input: '12 s',
        expected: 'X s',
      },
      {
        input: 'built 12 assets in 1.5s',
        expected: 'built 12 assets in Xs',
      },
      {
        input: '\u001b[1m\u001b[33m1.5\u001b[39m\u001b[22m s',
        expected: '\u001b[1m\u001b[33mX\u001b[39m\u001b[22m s',
      },
      {
        input: '\u001b[33m5.678s\u001b[39m',
        expected: '\u001b[33mXs\u001b[39m',
      },
      {
        input: 'Time: 123.456s',
        expected: 'Time: Xs',
      },
      // 测试多个时间值的情况
      {
        input: 'Time: 1.2s, 3.4s and 5.6s',
        expected: 'Time: Xs, Xs and Xs',
      },
      // 测试带有颜色的多个时间值
      {
        input: '\u001b[33m2.5s\u001b[39m and \u001b[32m1.8s\u001b[39m',
        expected: '\u001b[33mXs\u001b[39m and \u001b[32mXs\u001b[39m',
      },
    ];

    for (const { input, expected } of testCases) {
      expect(normalizeTime(input)).toBe(expected);
    }
  });

  test('should not replace non-time number patterns', () => {
    const testCases = [
      {
        input: './react/assets.svg',
        expected: './react/assets.svg',
      },
      {
        input: '123px',
        expected: '123px',
      },
      {
        input: 'Found 3 sources in 2 steps',
        expected: 'Found 3 sources in 2 steps',
      },
      {
        input: 'version 2 support',
        expected: 'version 2 support',
      },
      {
        input: '3sources and 2steps',
        expected: '3sources and 2steps',
      },
      {
        input: '\u001b[1m\u001b[33m3\u001b[39m\u001b[22m sources',
        expected: '\u001b[1m\u001b[33m3\u001b[39m\u001b[22m sources',
      },
      {
        input: 'version 1.2.3',
        expected: 'version 1.2.3',
      },
      {
        input: 'module.exports = path.sep',
        expected: 'module.exports = path.sep',
      },
      {
        input: 'a: url(7159cadb6967ca3.svg);',
        expected: 'a: url(7159cadb6967ca3.svg);',
      },
    ];

    for (const { input, expected } of testCases) {
      expect(normalizeTime(input)).toBe(expected);
    }
  });
});
