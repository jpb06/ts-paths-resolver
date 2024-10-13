import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Effect } from 'effect';
import {
  pathsAliasesMockData,
  transpiledCjsMockData,
} from '../../../../tests/mock-data/index.js';
import { transformImportStatements } from './transform-import-statements.js';
import { transformRequireStatements } from './transform-require-statements.js';

vi.mock('./transform-import-statements.ts');
vi.mock('./transform-require-statements.ts');

describe('transformWildcardAliases function', () => {
  const distPath = './dist';
  const rootDir = './src';
  const pathsAliases = Object.entries(pathsAliasesMockData);
  const sourceFilePath =
    'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array if the alias is not in input', async () => {
    const { transformWildcardAliases } = await import(
      './transform-wildcard-aliases.js'
    );

    const result = await runPromise(
      transformWildcardAliases(
        {
          distPath,
          rootDir,
          entryPoint: './cjs/index.js',
          sourceFilePath:
            'cjs/workflow/logic/transform-imports/wildcard-aliases/transform-require-statements.js',
        },
        pathsAliases[0],
        'yolo my bro',
      ),
    );

    expect(result).toStrictEqual([]);
  });

  it('should ', async () => {
    const writePath = `./dist/${sourceFilePath}`;
    vi.mocked(transformRequireStatements).mockReturnValueOnce(
      Effect.succeed(writePath),
    );
    vi.mocked(transformImportStatements).mockReturnValueOnce(
      Effect.succeed(writePath),
    );

    const { transformWildcardAliases } = await import(
      './transform-wildcard-aliases.js'
    );

    const result = await runPromise(
      transformWildcardAliases(
        {
          distPath,
          rootDir,
          entryPoint: './cjs/index.js',
          sourceFilePath,
        },
        pathsAliases[0],
        transpiledCjsMockData,
      ),
    );

    expect(result).toStrictEqual([writePath]);
  });
});
