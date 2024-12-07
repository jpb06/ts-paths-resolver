import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WriteFileStringError } from '@tests/errors';
import { makeFsTestLayer } from '@tests/layers';
import {
  pathsAliasesMockData,
  transpiledCjsMockData,
  transpiledEsmMockData,
} from '@tests/mock-data';

describe('transformRequireStatements function', () => {
  const distPath = './dist';
  const rootDir = './src';
  const pathsAliases = Object.entries(pathsAliasesMockData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing is no require statements are found', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { transformRequireStatements } = await import(
      './transform-require-statements.js'
    );

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const result = await runPromise(
      pipe(
        transformRequireStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledEsmMockData,
        ),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(writeFileStringMock).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  it('should raise a fsError if file write fails', async () => {
    const entryPoint = './cjs/index.js';
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer } = makeFsTestLayer({
      writeFileString: Effect.fail(new WriteFileStringError({})),
    });

    const { transformRequireStatements } = await import(
      './transform-require-statements.js'
    );

    const result = await Effect.runPromise(
      pipe(
        transformRequireStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledCjsMockData,
        ),
        Effect.flip,
        Effect.provide(FsTestLayer),
      ),
    );

    expect(result).toBeInstanceOf(WriteFileStringError);
  });

  it('should transform wildcard statements', async () => {
    const entryPoint = './cjs/index.js';
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformRequireStatements } = await import(
      './transform-require-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformRequireStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledCjsMockData,
        ),
        Effect.provide(FsTestLayer),
      ),
    );
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFileStringMock).toHaveBeenCalledTimes(1);
    const writePath = writeFileStringMock.mock.calls[0][0];
    const transformedData = writeFileStringMock.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain(
      'require("./../../../../dependencies/fs/index.js")',
    );
    expect(result).toBe(expectedWritePath);
  });

  it('should not transform files statements', async () => {
    const entryPoint = './cjs/index.js';
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformRequireStatements } = await import(
      './transform-require-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformRequireStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[2],
          transpiledCjsMockData,
        ),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(writeFileStringMock).toHaveBeenCalledTimes(0);
    expect(result).toBe(undefined);
  });
});
