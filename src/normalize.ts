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

export const normalizeCLR = (str: string): string => {
  return str
    .replace(/\u001b\[1m\u001b\[([0-9;]*)m/g, '<CLR=$1,BOLD>')
    .replace(/\u001b\[1m/g, '<CLR=BOLD>')
    .replace(/\u001b\[39m\u001b\[22m/g, '</CLR>')
    .replace(/\u001b\[([0-9;]*)m/g, '<CLR=$1>');
};

export const replaceDuration = (str: string): string => {
  // Preserve raw ANSI codes and normalized color markers between the value
  // and unit so time normalization works independently of color normalization.
  const unit = /(?:<\/CLR>|<CLR=[0-9;]*>|\u001b\[[0-9;]*m)*\s?s\b/y;
  // Consume each number once, even when no time unit follows. Combining these
  // patterns would retry the unit check at every digit of a long non-time value.
  return str.replace(/[0-9]+(?:\.[0-9]+)*/g, (value, offset: number) => {
    unit.lastIndex = offset + value.length;
    return unit.test(str) ? 'X' : value;
  });
};
