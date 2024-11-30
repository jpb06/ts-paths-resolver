import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReadFileStringError } from '@tests/errors';
import { makeFsTestLayer } from '@tests/layers';
import { pathsAliasesMockData, transpiledCjsMockData } from '@tests/mock-data';

vi.doMock('./wildcard-aliases/transform-wildcard-aliases.js');
vi.doMock('./file-aliases/transform-file-aliases.js');

describe('transformPathAliasesInFile function', () => {
  const distPath = './dist';
  const rootDir = './src';
  const entryPoint = './cjs/index.js';
  const sourceFilePath =
    'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';
  const pathsAliases = Object.entries(pathsAliasesMockData);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should fail with a fsError if reading source fails', async () => {
    const { FsTestLayer } = makeFsTestLayer({
      readFileString: Effect.fail(new ReadFileStringError({})),
    });

    const { transformPathAliasesInFile } = await import(
      './transform-path-aliases-in-file.js'
    );

    const result = await Effect.runPromise(
      pipe(
        transformPathAliasesInFile({
          distPath,
          rootDir,
          entryPoint,
          sourceFilePath,
        })(pathsAliases[0]),
        Effect.flip,
        Effect.provide(FsTestLayer),
      ),
    );

    expect(result).toBeInstanceOf(ReadFileStringError);
  });

  it('should call transformWildcardAliases', async () => {
    const expectedResult = ['wildcard'];

    const { transformWildcardAliases } = await import(
      './wildcard-aliases/transform-wildcard-aliases.js'
    );
    const { transformFileAliases } = await import(
      './file-aliases/transform-file-aliases.js'
    );

    const { FsTestLayer } = makeFsTestLayer({
      readFileString: Effect.succeed(transpiledCjsMockData),
    });

    vi.mocked(transformWildcardAliases).mockReturnValueOnce(
      Effect.succeed(expectedResult),
    );
    vi.mocked(transformFileAliases).mockReturnValueOnce(Effect.succeed([]));

    const { transformPathAliasesInFile } = await import(
      './transform-path-aliases-in-file.js'
    );

    const result = await runPromise(
      pipe(
        transformPathAliasesInFile({
          distPath,
          rootDir,
          entryPoint,
          sourceFilePath,
        })(pathsAliases[0]),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(transformWildcardAliases).toHaveBeenCalledTimes(1);
    expect(transformFileAliases).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call transformFileAliases', async () => {
    const expectedResult = ['path'];

    const { transformWildcardAliases } = await import(
      './wildcard-aliases/transform-wildcard-aliases.js'
    );
    const { transformFileAliases } = await import(
      './file-aliases/transform-file-aliases.js'
    );

    const { FsTestLayer } = makeFsTestLayer({
      readFileString: Effect.succeed(transpiledCjsMockData),
    });

    vi.mocked(transformWildcardAliases).mockReturnValueOnce(Effect.succeed([]));
    vi.mocked(transformFileAliases).mockReturnValueOnce(
      Effect.succeed(expectedResult),
    );

    const { transformPathAliasesInFile } = await import(
      './transform-path-aliases-in-file.js'
    );

    const result = await runPromise(
      pipe(
        transformPathAliasesInFile({
          distPath,
          rootDir,
          entryPoint,
          sourceFilePath,
        })(pathsAliases[2]),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(transformWildcardAliases).toHaveBeenCalledTimes(0);
    expect(transformFileAliases).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });
});
