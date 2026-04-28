import os from 'node:os';
import type { PathMatcher } from './types';
import { getRealTemporaryDirectory } from './utils';

export const createTmpDirMatchers = (): PathMatcher[] => {
  const ret: PathMatcher[] = [];
  const realTmpDir = getRealTemporaryDirectory();
  if (realTmpDir) {
    ret.push({ match: realTmpDir, mark: 'temp' });
  }

  const tmpDir = os.tmpdir();
  if (tmpDir) {
    ret.push({ match: tmpDir, mark: 'temp' });
  }
  return ret;
};

export const createHomeDirMatchers = (): PathMatcher[] => {
  const ret: PathMatcher[] = [];
  const homedir = os.homedir();
  if (homedir) {
    ret.push({ match: homedir, mark: 'home' });
  }
  return ret;
};
