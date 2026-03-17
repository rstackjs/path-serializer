import os from 'node:os';
import type { PathMatcher } from './types';
import { getRealTemporaryDirectory } from './utils';

export const createTmpDirMatchers = (): PathMatcher[] => {
  const ret: PathMatcher[] = [];
  const realTmpDir = getRealTemporaryDirectory();
  realTmpDir && ret.push({ match: realTmpDir, mark: 'temp' });

  const tmpDir = os.tmpdir();
  tmpDir && ret.push({ match: tmpDir, mark: 'temp' });
  return ret;
};

export const createHomeDirMatchers = (): PathMatcher[] => {
  const ret: PathMatcher[] = [];
  const homedir = os.homedir();
  homedir && ret.push({ match: homedir, mark: 'home' });
  return ret;
};

export const createPnpmInnerMatchers = (): PathMatcher[] => {
  return [
    // local virtual store - posix
    {
      match: /(?<=\/)(\.pnpm\/.+?\/node_modules)(?=\/)/g,
      mark: 'pnpmInner',
    },
    // local virtual store - win32
    {
      match: /(?<=\\)(\.pnpm\\.+?\\node_modules)(?=\\)/g,
      mark: 'pnpmInner',
    },
    // global virtual store - posix
    // e.g. Library/pnpm/store/v10/links/react/19.2.4/<hash>/node_modules
    {
      match: /(?<=\/)pnpm\/store\/[^/]+\/links\/.+?\/node_modules(?=\/)/g,
      mark: 'pnpmInner',
    },
    // global virtual store - win32
    {
      match: /(?<=\\)pnpm\\store\\[^\\]+\\links\\.+?\\node_modules(?=\\)/g,
      mark: 'pnpmInner',
    },
  ];
};
