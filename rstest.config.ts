import { fileURLToPath } from 'node:url';
import { withRslibConfig } from '@rstest/adapter-rslib';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  extends: withRslibConfig(),
  include: ['./src/**/*.test.ts', './e2e/**/*.test.ts'],
  resolve: {
    alias: {
      'path-serializer': fileURLToPath(
        new URL('./src/index.ts', import.meta.url),
      ),
    },
  },
});
