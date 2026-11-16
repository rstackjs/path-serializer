import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, test } from 'rstack/test';
import { createSnapshotSerializer } from 'path-serializer';

interface TestCase {
  input: string;
  output: string;
}

const features = { addDoubleQuotes: false, escapeDoubleQuotes: false };

describe('plain path boundaries', () => {
  const serializer = createSnapshotSerializer({
    root: '/project',
    workspace: '/project/packages/core',
    features,
  });

  test.each<TestCase>`
    input                                                    | output
    ${'/project-old'}                                        | ${'/project-old'}
    ${'/project-old/src/a.ts'}                               | ${'/project-old/src/a.ts'}
    ${'/project/packages/core-old'}                          | ${'<ROOT>/packages/core-old'}
    ${'/project/packages/core-old/src/a.ts'}                 | ${'<ROOT>/packages/core-old/src/a.ts'}
    ${'/project.old'}                                        | ${'/project.old'}
    ${'/project.old/src/a.ts'}                               | ${'/project.old/src/a.ts'}
    ${'/project/packages/core.old'}                          | ${'<ROOT>/packages/core.old'}
    ${'/project/packages/core.old/src/a.ts'}                 | ${'<ROOT>/packages/core.old/src/a.ts'}
    ${'/project2'}                                           | ${'/project2'}
    ${'/project2/src/a.ts'}                                  | ${'/project2/src/a.ts'}
    ${'/project/packages/core2'}                             | ${'<ROOT>/packages/core2'}
    ${'/project/packages/core2/src/a.ts'}                    | ${'<ROOT>/packages/core2/src/a.ts'}
    ${'/project_old'}                                        | ${'/project_old'}
    ${'/project_old/src/a.ts'}                               | ${'/project_old/src/a.ts'}
    ${'/project/packages/core_old'}                          | ${'<ROOT>/packages/core_old'}
    ${'/project/packages/core_old/src/a.ts'}                 | ${'<ROOT>/packages/core_old/src/a.ts'}
    ${'/project+old'}                                        | ${'/project+old'}
    ${'/project+old/src/a.ts'}                               | ${'/project+old/src/a.ts'}
    ${'/project/packages/core+old'}                          | ${'<ROOT>/packages/core+old'}
    ${'/project/packages/core+old/src/a.ts'}                 | ${'<ROOT>/packages/core+old/src/a.ts'}
    ${'/project@old'}                                        | ${'/project@old'}
    ${'/project@old/src/a.ts'}                               | ${'/project@old/src/a.ts'}
    ${'/project/packages/core@old'}                          | ${'<ROOT>/packages/core@old'}
    ${'/project/packages/core@old/src/a.ts'}                 | ${'<ROOT>/packages/core@old/src/a.ts'}
    ${'/project中文'}                                        | ${'/project中文'}
    ${'/project中文/src/a.ts'}                               | ${'/project中文/src/a.ts'}
    ${'/project/packages/core中文'}                          | ${'<ROOT>/packages/core中文'}
    ${'/project/packages/core中文/src/a.ts'}                 | ${'<ROOT>/packages/core中文/src/a.ts'}
    ${'/project'}                                            | ${'<ROOT>'}
    ${'/project/src/a.ts'}                                   | ${'<ROOT>/src/a.ts'}
    ${'\'/project\' "/project"'}                             | ${'\'<ROOT>\' "<ROOT>"'}
    ${'(/project:12:3)'}                                     | ${'(<ROOT>:12:3)'}
    ${'[/project]'}                                          | ${'[<ROOT>]'}
    ${'\u001b[32m/project\u001b[39m'}                        | ${'<CLR=32><ROOT><CLR=39>'}
    ${'/project\n/project next'}                             | ${'<ROOT>\n<ROOT> next'}
    ${'/project/packages/core'}                              | ${'<WORKSPACE>'}
    ${'/project/packages/core/src/a.ts'}                     | ${'<WORKSPACE>/src/a.ts'}
    ${'\'/project/packages/core\' "/project/packages/core"'} | ${'\'<WORKSPACE>\' "<WORKSPACE>"'}
    ${'(/project/packages/core:12:3)'}                       | ${'(<WORKSPACE>:12:3)'}
    ${'[/project/packages/core]'}                            | ${'[<WORKSPACE>]'}
    ${'\u001b[32m/project/packages/core\u001b[39m'}          | ${'<CLR=32><WORKSPACE><CLR=39>'}
    ${'/project/packages/core\n/project/packages/core next'} | ${'<WORKSPACE>\n<WORKSPACE> next'}
  `('$input → $output', ({ input, output }) => {
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

  test.each<TestCase>`
    input                                           | output
    ${`${rootURL}-old`}                             | ${`${rootURL}-old`}
    ${`${rootURL}-old/src/a.ts`}                    | ${`${rootURL}-old/src/a.ts`}
    ${`${workspaceURL}-old`}                        | ${'<ROOT>/packages/core-old'}
    ${`${workspaceURL}-old/src/a.ts`}               | ${'<ROOT>/packages/core-old/src/a.ts'}
    ${`${rootURL}.old`}                             | ${`${rootURL}.old`}
    ${`${rootURL}.old/src/a.ts`}                    | ${`${rootURL}.old/src/a.ts`}
    ${`${workspaceURL}.old`}                        | ${'<ROOT>/packages/core.old'}
    ${`${workspaceURL}.old/src/a.ts`}               | ${'<ROOT>/packages/core.old/src/a.ts'}
    ${`${rootURL}2`}                                | ${`${rootURL}2`}
    ${`${rootURL}2/src/a.ts`}                       | ${`${rootURL}2/src/a.ts`}
    ${`${workspaceURL}2`}                           | ${'<ROOT>/packages/core2'}
    ${`${workspaceURL}2/src/a.ts`}                  | ${'<ROOT>/packages/core2/src/a.ts'}
    ${`${rootURL}_old`}                             | ${`${rootURL}_old`}
    ${`${rootURL}_old/src/a.ts`}                    | ${`${rootURL}_old/src/a.ts`}
    ${`${workspaceURL}_old`}                        | ${'<ROOT>/packages/core_old'}
    ${`${workspaceURL}_old/src/a.ts`}               | ${'<ROOT>/packages/core_old/src/a.ts'}
    ${`${rootURL}+old`}                             | ${`${rootURL}+old`}
    ${`${rootURL}+old/src/a.ts`}                    | ${`${rootURL}+old/src/a.ts`}
    ${`${workspaceURL}+old`}                        | ${'<ROOT>/packages/core+old'}
    ${`${workspaceURL}+old/src/a.ts`}               | ${'<ROOT>/packages/core+old/src/a.ts'}
    ${`${rootURL}@old`}                             | ${`${rootURL}@old`}
    ${`${rootURL}@old/src/a.ts`}                    | ${`${rootURL}@old/src/a.ts`}
    ${`${workspaceURL}@old`}                        | ${'<ROOT>/packages/core@old'}
    ${`${workspaceURL}@old/src/a.ts`}               | ${'<ROOT>/packages/core@old/src/a.ts'}
    ${`${rootURL}%E4%B8%AD%E6%96%87`}               | ${`${rootURL}%E4%B8%AD%E6%96%87`}
    ${`${rootURL}%E4%B8%AD%E6%96%87/src/a.ts`}      | ${`${rootURL}%E4%B8%AD%E6%96%87/src/a.ts`}
    ${`${workspaceURL}%E4%B8%AD%E6%96%87`}          | ${'<ROOT>/packages/core%E4%B8%AD%E6%96%87'}
    ${`${workspaceURL}%E4%B8%AD%E6%96%87/src/a.ts`} | ${'<ROOT>/packages/core%E4%B8%AD%E6%96%87/src/a.ts'}
    ${rootURL}                                      | ${'<ROOT>'}
    ${`${rootURL}/src/a.ts`}                        | ${'<ROOT>/src/a.ts'}
    ${`'${rootURL}' "${rootURL}"`}                  | ${'\'<ROOT>\' "<ROOT>"'}
    ${`(${rootURL}:12:3)`}                          | ${'(<ROOT>:12:3)'}
    ${`[${rootURL}]`}                               | ${'[<ROOT>]'}
    ${`\u001b[32m${rootURL}\u001b[39m`}             | ${'<CLR=32><ROOT><CLR=39>'}
    ${`${rootURL}\n${rootURL} next`}                | ${'<ROOT>\n<ROOT> next'}
    ${workspaceURL}                                 | ${'<WORKSPACE>'}
    ${`${workspaceURL}/src/a.ts`}                   | ${'<WORKSPACE>/src/a.ts'}
    ${`'${workspaceURL}' "${workspaceURL}"`}        | ${'\'<WORKSPACE>\' "<WORKSPACE>"'}
    ${`(${workspaceURL}:12:3)`}                     | ${'(<WORKSPACE>:12:3)'}
    ${`[${workspaceURL}]`}                          | ${'[<WORKSPACE>]'}
    ${`\u001b[32m${workspaceURL}\u001b[39m`}        | ${'<CLR=32><WORKSPACE><CLR=39>'}
    ${`${workspaceURL}\n${workspaceURL} next`}      | ${'<WORKSPACE>\n<WORKSPACE> next'}
  `('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});

describe('Windows path boundaries', () => {
  const serializer = createSnapshotSerializer({
    root: 'C:\\project',
    workspace: 'C:\\project\\packages\\core',
    features,
  });

  test.each<TestCase>`
    input                                             | output
    ${'C:\\project'}                                  | ${'<ROOT>'}
    ${'C:\\project\\src\\a.ts'}                       | ${'<ROOT>/src/a.ts'}
    ${'C:\\project-old\\src\\a.ts'}                   | ${'/c/project-old/src/a.ts'}
    ${'C:\\project.old\\src\\a.ts'}                   | ${'/c/project.old/src/a.ts'}
    ${'C:\\project\\packages\\core'}                  | ${'<WORKSPACE>'}
    ${'C:\\project\\packages\\core-utils\\src\\a.ts'} | ${'<ROOT>/packages/core-utils/src/a.ts'}
    ${'\u001b[32mC:\\project\u001b[39m'}              | ${'<CLR=32><ROOT><CLR=39>'}
  `('$input → $output', ({ input, output }) => {
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

  test.each<TestCase>`
    input                                  | output
    ${inputPath}                           | ${'<ROOT>src/a.ts'}
    ${pathToFileURL(inputPath).toString()} | ${'<ROOT>src/a.ts'}
  `('$input → $output', ({ input, output }) => {
    expect(serializer.serialize(input)).toBe(output);
  });
});
