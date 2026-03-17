import fs from 'node:fs';
import os from 'node:os';
import { escapeRegExp } from 'lodash-es';

export function getRealTemporaryDirectory(): string | null {
  let ret: string | null = null;
  try {
    ret = os.tmpdir();
    ret = fs.realpathSync(ret);
  } catch {}
  return ret;
}

/**
 * Compile path string to RegExp.
 * @note Only support posix path.
 */
export function compilePathMatcherRegExp(match: string | RegExp): RegExp {
  if (typeof match !== 'string') {
    return match;
  }
  const escaped = escapeRegExp(match);
  return new RegExp(`(?<=\\W|^)${escaped}(?=\\W|$)`, 'g');
}

export function splitPathString(str: string): string[] {
  return str.split(/[\\/]/);
}

const PNPM_INNER_TOKEN = '<PNPM_INNER>';
const PNPM_INNER_DELIMITERS = /[\s!"']/;

/**
 * Strip environment-dependent path prefix before each `<PNPM_INNER>` token.
 * Uses string splitting instead of regex to avoid ReDoS.
 */
export function stripPnpmInnerPrefix(str: string): string {
  const parts = str.split(PNPM_INNER_TOKEN);
  if (parts.length <= 1) return str;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    let j = part.length - 1;
    while (j >= 0 && !PNPM_INNER_DELIMITERS.test(part[j])) {
      j--;
    }
    parts[i] = part.substring(0, j + 1);
  }

  return parts.join(PNPM_INNER_TOKEN);
}
