import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FsError } from '@dependencies/fs/fs.error.js';
import {
  pathsAliasesMockData,
  transpiledCjsMockData,
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

  it('should return an empty array if data contains no import/require statements', async () => {
    const sourceFilePath =
      'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

    const { transformFileAliases } = await import(
      './transform-file-aliases.js'
    );

    const result = await runPromise(
      transformFileAliases(
        {
          distPath,
          rootDir,
          entryPoint: './cjs/index.js',
          sourceFilePath,
        },
        pathsAliases[0],
        'yolo my bro',
      ),
    );

    expect(result).toStrictEqual([]);
  });

  describe('cjs', () => {
    it('should raise a fsError if file write fails', async () => {
      const sourceFilePath =
        'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      const errorCause = 'oh no';
      writeFile.mockRejectedValueOnce(errorCause);

      const result = await Effect.runPromise(
        pipe(
          transformFileAliases(
            {
              distPath,
              rootDir,
              entryPoint: './cjs/index.js',
              sourceFilePath,
            },
            pathsAliases[2],
            transpiledCjsMockData,
          ),
          Effect.flip,
        ),
      );

      expect(result).toBeInstanceOf(FsError);
      expect(result.cause).toBe(errorCause);
    });

    it('should transform file alias requires', async () => {
      const sourceFilePath =
        'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      writeFile.mockResolvedValueOnce();

      const result = await runPromise(
        transformFileAliases(
          {
            distPath,
            rootDir,
            entryPoint: './cjs/index.js',
            sourceFilePath,
          },
          pathsAliases[2],
          transpiledCjsMockData,
        ),
      );

      const expectedWritePath = `./dist/${sourceFilePath}`;
      expect(result).toStrictEqual([expectedWritePath]);
      expect(writeFile).toHaveBeenCalledTimes(1);
      const writePath = writeFile.mock.calls[0][0];
      const transformedData = writeFile.mock.calls[0][1];
      expect(writePath).toBe(expectedWritePath);
      expect(transformedData).toContain('require("./../../regex/regex.js")');
    });
  });

  describe('esm', () => {
    it('should raise a fsError if file write fails', async () => {
      const sourceFilePath =
        'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      const errorCause = 'Oh no';
      writeFile.mockRejectedValueOnce(errorCause);

      const result = await Effect.runPromise(
        pipe(
          transformFileAliases(
            {
              distPath,
              rootDir,
              entryPoint: './esm/index.js',
              sourceFilePath,
            },
            pathsAliases[2],
            transpiledCjsMockData,
          ),
          Effect.flip,
        ),
      );

      expect(result).toBeInstanceOf(FsError);
      expect(result.cause).toBe(errorCause);
    });

    it('should transform file alias imports', async () => {
      const sourceFilePath =
        'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      writeFile.mockResolvedValueOnce();

      const result = await runPromise(
        transformFileAliases(
          {
            distPath,
            rootDir,
            entryPoint: './esm/index.js',
            sourceFilePath,
          },
          pathsAliases[2],
          transpiledEsmMockData,
        ),
      );

      const expectedWritePath = `./dist/${sourceFilePath}`;
      expect(result).toStrictEqual([expectedWritePath]);
      expect(writeFile).toHaveBeenCalledTimes(1);
      const writePath = writeFile.mock.calls[0][0];
      const transformedData = writeFile.mock.calls[0][1];
      expect(writePath).toBe(expectedWritePath);
      expect(transformedData).toContain(
        "import { requirePathRegex } from './../../regex/regex.js'",
      );
    });
  });
});
