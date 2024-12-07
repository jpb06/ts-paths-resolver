import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WriteFileStringError } from '@tests/errors';
import { makeFsTestLayer } from '@tests/layers';
import {
  pathsAliasesMockData,
  transpiledCjsMockData,
  transpiledDtsMockData,
  transpiledEsmMockData,
  transpiledEsmWithMultipleDynamicImportsMockData,
  transpiledEsmWithMultipleSimilarImportsMockData,
} from '@tests/mock-data';

describe('transformImportStatements function', () => {
  const distPath = './dist';
  const rootDir = './src';
  const pathsAliases = Object.entries(pathsAliasesMockData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing if no import statements are found', async () => {
    const entryPoint = './cjs/index.js';
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
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

    expect(writeFileStringMock).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  it('should raise an error if file write fails', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.fail(new WriteFileStringError({})),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await Effect.runPromise(
      pipe(
        transformImportStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledEsmMockData,
        ),
        Effect.flip,
        Effect.provide(FsTestLayer),
      ),
    );

    expect(writeFileStringMock).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(WriteFileStringError);
  });

  it('should transform wildcard statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
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
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFileStringMock).toHaveBeenCalledTimes(1);
    const writePath = writeFileStringMock.mock.calls[0][0];
    const transformedData = writeFileStringMock.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain(
      "import { writeFileEffect } from './../../../../dependencies/fs/index.js';",
    );
    expect(result).toBe(expectedWritePath);
  });

  it('should transform dynamic statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledDtsMockData,
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
      'import("./../../../../dependencies/fs/index.js")',
    );
    expect(result).toBe(expectedWritePath);
  });

  it('should transform multiple wildcard statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledEsmWithMultipleSimilarImportsMockData,
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
      "import { writeFileEffect } from './../../../../dependencies/fs/index.js';",
    );
    expect(transformedData).toContain(
      "import { writeFileEffect } from './../../../../dependencies/http/index.js';",
    );
    expect(transformedData).toContain(
      "import { writeFileEffect } from './../../../../dependencies/yolo/cool/bro/index.js';",
    );
    expect(result).toBe(expectedWritePath);
  });

  it('should transform multiple dynamic statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
      writeFileString: Effect.succeed(''),
    });

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[0],
          transpiledEsmWithMultipleDynamicImportsMockData,
        ),
        Effect.provide(FsTestLayer),
      ),
    );
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFileStringMock).toHaveBeenCalledTimes(1);
    const writePath = writeFileStringMock.mock.calls[0][0];
    const transformedData = writeFileStringMock.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain('./../../../../dependencies/fs/index.js');
    expect(transformedData).toContain(
      './../../../../dependencies/http/index.js',
    );
    expect(transformedData).toContain(
      './../../../../dependencies/yolo/bro/index.js',
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

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
      pipe(
        transformImportStatements(
          {
            distPath,
            rootDir,
            entryPoint,
            sourceFilePath,
          },
          pathsAliases[2],
          transpiledEsmMockData,
        ),
        Effect.provide(FsTestLayer),
      ),
    );

    expect(writeFileStringMock).toHaveBeenCalledTimes(0);
    expect(result).toBe(undefined);
  });
});
