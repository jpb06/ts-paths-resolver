import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pathsAliasesMockData } from '@tests/mock-data';

vi.doMock('./transform-path-aliases-in-file.js');

describe('transformFileDependencies function', () => {
  const distPath = './dist';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call transformPathAliasesInFile for each file', async () => {
    const { transformPathAliasesInFile } = await import(
      './transform-path-aliases-in-file.js'
    );

    vi.mocked(transformPathAliasesInFile).mockImplementation(
      (arg) => () => Effect.succeed([arg.sourceFilePath]),
    );

    const { transformFileDependencies } = await import(
      './transform-file-dependencies.js'
    );

    const filesByEntryPoint = [
      {
        entryPoint: 'cjs/index.js',
        files: ['a/b/c.js', 'a/d.js', 'cool.js'],
      },
      {
        entryPoint: 'esm/index.js',
        files: ['a/b/c.js', 'a/d.js', 'cool.js'],
      },
      {
        entryPoint: 'dts/index.js',
        files: ['a/b/c.d.ts', 'a/d.d.ts', 'cool.d.ts'],
      },
    ];

    const result = await runPromise(
      pipe(
        transformFileDependencies(
          distPath,
          {
            rootDir: './src',
            tsPathAliases: pathsAliasesMockData,
          },
          filesByEntryPoint,
        ),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(vi.mocked(transformPathAliasesInFile).mock.calls).toHaveLength(9);
    expect(vi.mocked(transformPathAliasesInFile).mock.calls).toMatchSnapshot();
    expect(result).toMatchInlineSnapshot(`
      [
        "a/b/c.js",
        "a/d.js",
        "cool.js",
        "a/b/c.d.ts",
        "a/d.d.ts",
        "cool.d.ts",
      ]
    `);
  });
});
