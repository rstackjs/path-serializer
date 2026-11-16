import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, test } from 'rstack/test';
import { createSnapshotSerializer } from 'path-serializer';

const features = { addDoubleQuotes: false, escapeDoubleQuotes: false };

describe('plain path boundaries', () => {
  const serializer = createSnapshotSerializer({
    root: '/project',
    workspace: '/project/packages/core',
    features,
  });

  test.each([
    {
      input: '/project-old',
      output: '/project-old',
    },
    {
      input: '/project-old/src/a.ts',
      output: '/project-old/src/a.ts',
    },
    {
      input: '/project/packages/core-old',
      output: '<ROOT>/packages/core-old',
    },
    {
      input: '/project/packages/core-old/src/a.ts',
      output: '<ROOT>/packages/core-old/src/a.ts',
    },
    {
      input: '/project.old',
      output: '/project.old',
    },
    {
      input: '/project.old/src/a.ts',
      output: '/project.old/src/a.ts',
    },
    {
      input: '/project/packages/core.old',
      output: '<ROOT>/packages/core.old',
    },
    {
      input: '/project/packages/core.old/src/a.ts',
      output: '<ROOT>/packages/core.old/src/a.ts',
    },
    {
      input: '/project2',
      output: '/project2',
    },
    {
      input: '/project2/src/a.ts',
      output: '/project2/src/a.ts',
    },
    {
      input: '/project/packages/core2',
      output: '<ROOT>/packages/core2',
    },
    {
      input: '/project/packages/core2/src/a.ts',
      output: '<ROOT>/packages/core2/src/a.ts',
    },
    {
      input: '/project_old',
      output: '/project_old',
    },
    {
      input: '/project_old/src/a.ts',
      output: '/project_old/src/a.ts',
    },
    {
      input: '/project/packages/core_old',
      output: '<ROOT>/packages/core_old',
    },
    {
      input: '/project/packages/core_old/src/a.ts',
      output: '<ROOT>/packages/core_old/src/a.ts',
    },
    {
      input: '/project+old',
      output: '/project+old',
    },
    {
      input: '/project+old/src/a.ts',
      output: '/project+old/src/a.ts',
    },
    {
      input: '/project/packages/core+old',
      output: '<ROOT>/packages/core+old',
    },
    {
      input: '/project/packages/core+old/src/a.ts',
      output: '<ROOT>/packages/core+old/src/a.ts',
    },
    {
      input: '/project@old',
      output: '/project@old',
    },
    {
      input: '/project@old/src/a.ts',
      output: '/project@old/src/a.ts',
    },
    {
      input: '/project/packages/core@old',
      output: '<ROOT>/packages/core@old',
    },
    {
      input: '/project/packages/core@old/src/a.ts',
      output: '<ROOT>/packages/core@old/src/a.ts',
    },
    {
      input: '/project中文',
      output: '/project中文',
    },
    {
      input: '/project中文/src/a.ts',
      output: '/project中文/src/a.ts',
    },
    {
      input: '/project/packages/core中文',
      output: '<ROOT>/packages/core中文',
    },
    {
      input: '/project/packages/core中文/src/a.ts',
      output: '<ROOT>/packages/core中文/src/a.ts',
    },
    {
      input: '/project',
      output: '<ROOT>',
    },
    {
      input: '/project/src/a.ts',
      output: '<ROOT>/src/a.ts',
    },
    {
      input: '\'/project\' "/project"',
      output: '\'<ROOT>\' "<ROOT>"',
    },
    {
      input: '(/project:12:3)',
      output: '(<ROOT>:12:3)',
    },
    {
      input: '[/project]',
      output: '[<ROOT>]',
    },
    {
      input: '\u001b[32m/project\u001b[39m',
      output: '<CLR=32><ROOT><CLR=39>',
    },
    {
      input: '/project\n/project next',
      output: '<ROOT>\n<ROOT> next',
    },
    {
      input: '/project/packages/core',
      output: '<WORKSPACE>',
    },
    {
      input: '/project/packages/core/src/a.ts',
      output: '<WORKSPACE>/src/a.ts',
    },
    {
      input: '\'/project/packages/core\' "/project/packages/core"',
      output: '\'<WORKSPACE>\' "<WORKSPACE>"',
    },
    {
      input: '(/project/packages/core:12:3)',
      output: '(<WORKSPACE>:12:3)',
    },
    {
      input: '[/project/packages/core]',
      output: '[<WORKSPACE>]',
    },
    {
      input: '\u001b[32m/project/packages/core\u001b[39m',
      output: '<CLR=32><WORKSPACE><CLR=39>',
    },
    {
      input: '/project/packages/core\n/project/packages/core next',
      output: '<WORKSPACE>\n<WORKSPACE> next',
    },
  ])('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});

describe('file URL boundaries', () => {
  const root = path.resolve('/project');
  const workspace = path.join(root, 'packages/core');
  // Build URLs with the current platform's drive prefix and URL encoding.
  const rootURL = pathToFileURL(root).toString();
  const workspaceURL = pathToFileURL(workspace).toString();
  const serializer = createSnapshotSerializer({ root, workspace, features });

  test.each([
    {
      input: `${rootURL}-old`,
      output: `${rootURL}-old`,
    },
    {
      input: `${rootURL}-old/src/a.ts`,
      output: `${rootURL}-old/src/a.ts`,
    },
    {
      input: `${workspaceURL}-old`,
      output: '<ROOT>/packages/core-old',
    },
    {
      input: `${workspaceURL}-old/src/a.ts`,
      output: '<ROOT>/packages/core-old/src/a.ts',
    },
    {
      input: `${rootURL}.old`,
      output: `${rootURL}.old`,
    },
    {
      input: `${rootURL}.old/src/a.ts`,
      output: `${rootURL}.old/src/a.ts`,
    },
    {
      input: `${workspaceURL}.old`,
      output: '<ROOT>/packages/core.old',
    },
    {
      input: `${workspaceURL}.old/src/a.ts`,
      output: '<ROOT>/packages/core.old/src/a.ts',
    },
    {
      input: `${rootURL}2`,
      output: `${rootURL}2`,
    },
    {
      input: `${rootURL}2/src/a.ts`,
      output: `${rootURL}2/src/a.ts`,
    },
    {
      input: `${workspaceURL}2`,
      output: '<ROOT>/packages/core2',
    },
    {
      input: `${workspaceURL}2/src/a.ts`,
      output: '<ROOT>/packages/core2/src/a.ts',
    },
    {
      input: `${rootURL}_old`,
      output: `${rootURL}_old`,
    },
    {
      input: `${rootURL}_old/src/a.ts`,
      output: `${rootURL}_old/src/a.ts`,
    },
    {
      input: `${workspaceURL}_old`,
      output: '<ROOT>/packages/core_old',
    },
    {
      input: `${workspaceURL}_old/src/a.ts`,
      output: '<ROOT>/packages/core_old/src/a.ts',
    },
    {
      input: `${rootURL}+old`,
      output: `${rootURL}+old`,
    },
    {
      input: `${rootURL}+old/src/a.ts`,
      output: `${rootURL}+old/src/a.ts`,
    },
    {
      input: `${workspaceURL}+old`,
      output: '<ROOT>/packages/core+old',
    },
    {
      input: `${workspaceURL}+old/src/a.ts`,
      output: '<ROOT>/packages/core+old/src/a.ts',
    },
    {
      input: `${rootURL}@old`,
      output: `${rootURL}@old`,
    },
    {
      input: `${rootURL}@old/src/a.ts`,
      output: `${rootURL}@old/src/a.ts`,
    },
    {
      input: `${workspaceURL}@old`,
      output: '<ROOT>/packages/core@old',
    },
    {
      input: `${workspaceURL}@old/src/a.ts`,
      output: '<ROOT>/packages/core@old/src/a.ts',
    },
    {
      input: `${rootURL}%E4%B8%AD%E6%96%87`,
      output: `${rootURL}%E4%B8%AD%E6%96%87`,
    },
    {
      input: `${rootURL}%E4%B8%AD%E6%96%87/src/a.ts`,
      output: `${rootURL}%E4%B8%AD%E6%96%87/src/a.ts`,
    },
    {
      input: `${workspaceURL}%E4%B8%AD%E6%96%87`,
      output: '<ROOT>/packages/core%E4%B8%AD%E6%96%87',
    },
    {
      input: `${workspaceURL}%E4%B8%AD%E6%96%87/src/a.ts`,
      output: '<ROOT>/packages/core%E4%B8%AD%E6%96%87/src/a.ts',
    },
    {
      input: rootURL,
      output: '<ROOT>',
    },
    {
      input: `${rootURL}/src/a.ts`,
      output: '<ROOT>/src/a.ts',
    },
    {
      input: `'${rootURL}' "${rootURL}"`,
      output: '\'<ROOT>\' "<ROOT>"',
    },
    {
      input: `(${rootURL}:12:3)`,
      output: '(<ROOT>:12:3)',
    },
    {
      input: `[${rootURL}]`,
      output: '[<ROOT>]',
    },
    {
      input: `\u001b[32m${rootURL}\u001b[39m`,
      output: '<CLR=32><ROOT><CLR=39>',
    },
    {
      input: `${rootURL}\n${rootURL} next`,
      output: '<ROOT>\n<ROOT> next',
    },
    {
      input: workspaceURL,
      output: '<WORKSPACE>',
    },
    {
      input: `${workspaceURL}/src/a.ts`,
      output: '<WORKSPACE>/src/a.ts',
    },
    {
      input: `'${workspaceURL}' "${workspaceURL}"`,
      output: '\'<WORKSPACE>\' "<WORKSPACE>"',
    },
    {
      input: `(${workspaceURL}:12:3)`,
      output: '(<WORKSPACE>:12:3)',
    },
    {
      input: `[${workspaceURL}]`,
      output: '[<WORKSPACE>]',
    },
    {
      input: `\u001b[32m${workspaceURL}\u001b[39m`,
      output: '<CLR=32><WORKSPACE><CLR=39>',
    },
    {
      input: `${workspaceURL}\n${workspaceURL} next`,
      output: '<WORKSPACE>\n<WORKSPACE> next',
    },
  ])('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});

describe('Windows path boundaries', () => {
  const serializer = createSnapshotSerializer({
    root: 'C:\\project',
    workspace: 'C:\\project\\packages\\core',
    features,
  });

  test.each([
    {
      input: 'C:\\project',
      output: '<ROOT>',
    },
    {
      input: 'C:\\project\\src\\a.ts',
      output: '<ROOT>/src/a.ts',
    },
    {
      input: 'C:\\project-old\\src\\a.ts',
      output: '/c/project-old/src/a.ts',
    },
    {
      input: 'C:\\project.old\\src\\a.ts',
      output: '/c/project.old/src/a.ts',
    },
    {
      input: 'C:\\project\\packages\\core',
      output: '<WORKSPACE>',
    },
    {
      input: 'C:\\project\\packages\\core-utils\\src\\a.ts',
      output: '<ROOT>/packages/core-utils/src/a.ts',
    },
    {
      input: '\u001b[32mC:\\project\u001b[39m',
      output: '<CLR=32><ROOT><CLR=39>',
    },
  ])('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});

describe('configured paths with a trailing separator', () => {
  const directory = path.resolve('/project/my project[app]');
  const inputPath = path.join(directory, 'src/a.ts');
  const serializer = createSnapshotSerializer({
    root: `${directory}${path.sep}`,
    features,
  });

  test.each([
    {
      input: inputPath,
      output: '<ROOT>src/a.ts',
    },
    {
      input: pathToFileURL(inputPath).toString(),
      output: '<ROOT>src/a.ts',
    },
  ])('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});
