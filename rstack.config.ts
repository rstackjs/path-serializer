// Configuration guide: https://rstack.rs/config
import { define } from 'rstack';

define.lib(async () => {
  const { pluginPublint } = await import('rsbuild-plugin-publint');

  return {
    lib: [
      {
        format: 'esm',
        syntax: 'es2023',
        dts: {
          bundle: true,
          tsgo: true,
        },
        output: {
          distPath: {
            root: './dist/esm',
          },
        },
      },
      {
        format: 'cjs',
        syntax: 'es2023',
        dts: {
          bundle: true,
          tsgo: true,
        },
        output: {
          distPath: {
            root: './dist/cjs',
          },
        },
      },
    ],
    source: {
      entry: {
        index: './src/index.ts',
      },
    },
    output: {
      target: 'node',
    },
    plugins: [pluginPublint()],
  };
});

define.test({
  include: ['./src/**/*.test.ts', './e2e/**/*.test.ts'],
});

define.lint(({ ts }) => [
  ts.configs.recommended,
  {
    rules: {
      'no-control-regex': 'off',
    },
  },
]);

define.fmt({
  singleQuote: true,
});

define.staged({
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': ['rs lint --fix', 'rs fmt'],
  '*.{json,md,mdx,css,scss,less,html,yml,yaml}': 'rs fmt',
});
