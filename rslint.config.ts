import { defineConfig, ts } from '@rslint/core';

export default defineConfig([
  ts.configs.recommended,
  {
    rules: {
      'no-control-regex': 'off',
    },
  },
]);
