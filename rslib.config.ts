import { defineConfig } from '@rslib/core';
import { pluginPublint } from 'rsbuild-plugin-publint';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: {
        bundle: true,
      },
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
    {
      format: 'cjs',
      dts: {
        bundle: true,
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
});
