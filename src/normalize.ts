import path from 'node:path';
import upath from 'upath';

export const normalizePathToPosix = (p: string | undefined): string => {
  return upath
    .normalizeSafe(path.normalize(p || ''))
    .replace(
      /^([a-zA-Z]+):/,
      (_match: string, m: string) => `/${m.toLowerCase()}`,
    );
};

// find the path in code and replace it with normalizePathToPosix
export const normalizeCodeToPosix = (code: string): string => {
  return code.replace(
    // windows absolute path
    // ignore http, https, file
    /(?<![a-zA-Z])([a-zA-Z]:[\\/]+)([-\u4e00-\u9fa5\w\s.()~!@#$%^&()[\]{}+=]+[\\/]+)*/g,
    (match: string, _diskName: string) => {
      return normalizePathToPosix(match.replace(/[\\]{2,}/g, '\\'));
    },
  );
};

const ANSI_ESCAPE = String.raw`\u001b`;
const ANSI_BOLD_COLOR_REGEXP = new RegExp(
  `${ANSI_ESCAPE}\\[1m${ANSI_ESCAPE}\\[([0-9;]*)m`,
  'g',
);
const ANSI_BOLD_REGEXP = new RegExp(`${ANSI_ESCAPE}\\[1m`, 'g');
const ANSI_RESET_REGEXP = new RegExp(
  `${ANSI_ESCAPE}\\[39m${ANSI_ESCAPE}\\[22m`,
  'g',
);
const ANSI_COLOR_REGEXP = new RegExp(`${ANSI_ESCAPE}\\[([0-9;]*)m`, 'g');

export const normalizeCLR = (str: string): string => {
  return (
    str
      .replace(ANSI_BOLD_COLOR_REGEXP, '<CLR=$1,BOLD>')
      .replace(ANSI_BOLD_REGEXP, '<CLR=BOLD>')
      .replace(ANSI_RESET_REGEXP, '</CLR>')
      .replace(ANSI_COLOR_REGEXP, '<CLR=$1>')
      // CHANGE: The time unit display in Rspack is second
      // CHANGE2: avoid a bad case "./react/assets.svg" -> "./react/assetsXsvg"
      // modified based on https://github.com/webpack/webpack/blob/001cab14692eb9a833c6b56709edbab547e291a1/test/StatsTestCases.basictest.js#L199
      .replace(/[0-9]+(\.[0-9]+)*(<\/CLR>)?(\s?s)/g, 'X$2$3')
  );
};
