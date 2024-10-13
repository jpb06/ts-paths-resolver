import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FsError } from '@dependencies/fs/fs.error.js';
import {
  pathsAliasesMockData,
  transpiledCjsMockData,
  transpiledDtsMockData,
  transpiledEsmMockData,
} from '@tests/mock-data';
import { mockFs } from '@tests/mocks';

describe('transformImportStatements function', () => {
  const { writeFile } = mockFs();

  const distPath = './dist';
  const rootDir = './src';
  const pathsAliases = Object.entries(pathsAliasesMockData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing is no import statements are found', async () => {
    const entryPoint = './cjs/index.js';
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
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
    );

    expect(writeFile).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  it('should raise a fsError if file write fails', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const errorCause = 'Oh no!';
    writeFile.mockRejectedValueOnce(errorCause);

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
      ),
    );

    expect(result).toBeInstanceOf(FsError);
    expect(result.cause).toBe(errorCause);
  });

  it('should transform wildcard statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    writeFile.mockResolvedValueOnce();

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
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
    );
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFile).toHaveBeenCalledTimes(1);
    const writePath = writeFile.mock.calls[0][0];
    const transformedData = writeFile.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain(
      "import { writeFileEffect } from './../../../../dependencies/fs/index.js';",
    );
    expect(result).toBe(expectedWritePath);
  });

  it('should transform files statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    writeFile.mockResolvedValueOnce();

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
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
    );
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFile).toHaveBeenCalledTimes(1);
    const writePath = writeFile.mock.calls[0][0];
    const transformedData = writeFile.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain('./../../regex/regex.tx/index.js');
    expect(result).toBe(expectedWritePath);
  });

  it('should transform dynamic statements', async () => {
    const entryPoint = './esm/index.js';
    const sourceFilePath =
      'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    writeFile.mockResolvedValueOnce();

    const { transformImportStatements } = await import(
      './transform-import-statements.js'
    );

    const result = await runPromise(
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
    );
    const expectedWritePath = `./dist/${sourceFilePath}`;

    expect(writeFile).toHaveBeenCalledTimes(1);
    const writePath = writeFile.mock.calls[0][0];
    const transformedData = writeFile.mock.calls[0][1];
    expect(writePath).toBe(expectedWritePath);
    expect(transformedData).toContain(
      'import("./../../../../dependencies/fs/index.js")',
    );
    expect(result).toBe(expectedWritePath);
  });
});
