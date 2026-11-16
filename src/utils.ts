import fs from 'node:fs';
import os from 'node:os';
import { escapeRegExp } from 'lodash-es';

export function getRealTemporaryDirectory(): string | null {
  try {
    return fs.realpathSync(os.tmpdir());
  } catch {
    return null;
  }
}

/**
 * Compile path string to RegExp.
 * @note Only support posix path.
 */
export function compilePathMatcherRegExp(match: string | RegExp): RegExp {
  if (typeof match !== 'string') {
    return match;
  }
  // A configured directory's trailing slash belongs to the child path, not
  // the placeholder. Keep filesystem roots intact instead of matching "".
  let end = match.length;
  while (end > 0 && match[end - 1] === '/') {
    end--;
  }
  const prefix = match.slice(0, end);
  const directory = !prefix || prefix === 'file:' ? match : prefix;
  const escaped = escapeRegExp(directory);
  // Match separators and common log delimiters, not sibling names such as
  // "project-old" or "project.old". A trailing slash already marks a boundary.
  const boundary = directory.endsWith('/')
    ? ''
    : String.raw`(?=[/\s"'\x60)\]}:?#,;<>\x1b]|$)`;
  return new RegExp(`(?<=\\W|^|\\x1b\\[[0-9;]*m)${escaped}${boundary}`, 'g');
}

export function splitPathString(str: string): string[] {
  return str.split(/[\\/]/);
}
