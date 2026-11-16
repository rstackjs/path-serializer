import { pathToFileURL } from 'node:url';
import { applyMatcherReplacement } from './applyMatcherReplacement';
import { createHomeDirMatchers, createTmpDirMatchers } from './matchers';
import {
  normalizeCLR,
  normalizeCodeToPosix,
  normalizePathToPosix,
  replaceDuration,
} from './normalize';
import { replacePnpmInnerPath } from './pnpm';
import type { PathMatcher, SnapshotSerializerOptions } from './types';
import { compilePathMatcherRegExp } from './utils';

export interface SnapshotSerializer {
  serialize: (val: unknown) => string;
  test: (arg0: unknown) => boolean;
}

export function createSnapshotSerializer(
  options?: SnapshotSerializerOptions,
): SnapshotSerializer {
  const {
    root = process.cwd(),
    workspace = '',
    replace: customMatchers = [],
    replacePost: customPostMatchers = [],
    features = {},
    beforeSerialize,
    afterSerialize,
  } = options || {};

  const {
    replaceWorkspaceWithFileProtocol = true,
    replaceWorkspace = true,
    replaceRootWithFileProtocol = true,
    replaceRoot = true,
    replacePnpmInner = true,
    replaceTmpDir = true,
    replaceHomeDir = true,
    addDoubleQuotes = true,
    transformWin32Path = true,
    escapeDoubleQuotes = true,
    escapeEOL = true,
    transformCLR = true,
    replaceDuration: replaceDurationEnabled = true,
  } = features;

  function createPathMatchers(): PathMatcher[] {
    const pathMatchers: PathMatcher[] = [];
    pathMatchers.push(...customMatchers);
    if (replaceWorkspace && workspace) {
      pathMatchers.push({ mark: 'workspace', match: workspace });
    }
    if (replaceRoot && root) {
      pathMatchers.push({ mark: 'root', match: root });
    }
    if (replaceTmpDir) {
      pathMatchers.push(...createTmpDirMatchers());
    }
    if (replaceHomeDir) {
      pathMatchers.push(...createHomeDirMatchers());
    }
    pathMatchers.push(...customPostMatchers);
    return pathMatchers;
  }
  const pathMatchers: PathMatcher[] = createPathMatchers();
  const workspaceWithFileProtocol =
    replaceWorkspaceWithFileProtocol && workspace
      ? compilePathMatcherRegExp(pathToFileURL(workspace).toString())
      : undefined;
  const rootWithFileProtocol =
    replaceRootWithFileProtocol && root
      ? compilePathMatcherRegExp(pathToFileURL(root).toString())
      : undefined;

  for (const matcher of pathMatchers) {
    if (typeof matcher.match === 'string') {
      matcher.match = normalizePathToPosix(matcher.match);
    }
  }

  const serializer: SnapshotSerializer = {
    // match path-format string
    test(val: unknown) {
      return typeof val === 'string';
    },
    serialize(val: unknown) {
      let replaced: string = val as string;

      if (beforeSerialize) {
        replaced = beforeSerialize(replaced);
      }

      if (workspaceWithFileProtocol) {
        replaced = replaced.replace(workspaceWithFileProtocol, '<WORKSPACE>');
      }

      if (rootWithFileProtocol) {
        replaced = replaced.replace(rootWithFileProtocol, '<ROOT>');
      }

      if (transformWin32Path) {
        replaced = normalizeCodeToPosix(replaced);
      }

      replaced = applyMatcherReplacement(pathMatchers, replaced);

      if (replacePnpmInner) {
        replaced = replacePnpmInnerPath(replaced);
      }

      if (transformCLR) {
        replaced = normalizeCLR(replaced);
      }

      if (replaceDurationEnabled) {
        replaced = replaceDuration(replaced);
      }

      if (escapeDoubleQuotes) {
        replaced = replaced.replace(/"/g, '\\"');
      }
      if (escapeEOL) {
        replaced = replaced.replace(/\\r\\n/g, '\\n');
      }
      if (addDoubleQuotes) {
        replaced = `"${replaced}"`;
      }

      if (afterSerialize) {
        replaced = afterSerialize(replaced);
      }
      return replaced;
    },
  };
  return serializer;
}
