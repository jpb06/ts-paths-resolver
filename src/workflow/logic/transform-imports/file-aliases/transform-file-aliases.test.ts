import { NodeFileSystem } from '@effect/platform-node';
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

describe('transformImportStatements function', () => {
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
      pipe(
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
        Effect.provide(NodeFileSystem.layer),
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

      const { FsTestLayer } = makeFsTestLayer({
        writeFileString: Effect.fail(new WriteFileStringError({})),
      });

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
          Effect.provide(FsTestLayer),
        ),
      );

      expect(result).toBeInstanceOf(WriteFileStringError);
    });

    it('should transform file alias requires', async () => {
      const sourceFilePath =
        'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
        writeFileString: Effect.succeed(''),
      });

      const result = await runPromise(
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
          Effect.provide(FsTestLayer),
        ),
      );

      const expectedWritePath = `./dist/${sourceFilePath}`;
      expect(result).toStrictEqual([expectedWritePath]);
      expect(writeFileStringMock).toHaveBeenCalledTimes(1);
      const writePath = writeFileStringMock.mock.calls[0][0];
      const transformedData = writeFileStringMock.mock.calls[0][1];
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

      const { FsTestLayer } = makeFsTestLayer({
        writeFileString: Effect.fail(new WriteFileStringError({})),
      });

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
          Effect.provide(FsTestLayer),
        ),
      );

      expect(result).toBeInstanceOf(WriteFileStringError);
    });

    it('should transform file alias imports', async () => {
      const sourceFilePath =
        'esm/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

      const { transformFileAliases } = await import(
        './transform-file-aliases.js'
      );

      const { FsTestLayer, writeFileStringMock } = makeFsTestLayer({
        writeFileString: Effect.succeed(''),
      });

      const result = await runPromise(
        pipe(
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
          Effect.provide(FsTestLayer),
        ),
      );

      const expectedWritePath = `./dist/${sourceFilePath}`;
      expect(result).toStrictEqual([expectedWritePath]);
      expect(writeFileStringMock).toHaveBeenCalledTimes(1);
      const writePath = writeFileStringMock.mock.calls[0][0];
      const transformedData = writeFileStringMock.mock.calls[0][1];
      expect(writePath).toBe(expectedWritePath);
      expect(transformedData).toContain(
        "import { requirePathRegex } from './../../regex/regex.js'",
      );
    });
  });
});
