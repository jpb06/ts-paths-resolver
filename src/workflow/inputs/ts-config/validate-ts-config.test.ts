import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { FsError } from '@dependencies/fs/fs.error.js';
import {
  tsconfigMockData,
  tsconfigWithoutPathsMockData,
  tsconfigWithoutRootDirMockData,
} from '@tests/mock-data';
import { mockFs } from '@tests/mocks';

import { InvalidTsConfigFileError } from './invalid-ts-config.error.js';

describe('validateTsConfig function', () => {
  const { stat, readFile } = mockFs();

  it('should fail is file does not exist', async () => {
    const path = './tsconfig.json';

    stat.mockRejectedValueOnce({
      code: 'ENOENT',
    });

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip),
    );

    expect(result).toBeInstanceOf(FsError);
    expect(result.cause).toBe(`tsconfig.json file not found at ${path}`);
  });

  it('should fail is tsconfig has no paths', async () => {
    const path = './tsconfig.json';

    stat.mockResolvedValueOnce({} as never);
    readFile.mockResolvedValueOnce(tsconfigWithoutPathsMockData);

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing paths');
  });

  it('should fail is tsconfig has no root dir', async () => {
    const path = './tsconfig.json';

    stat.mockResolvedValueOnce({} as never);
    readFile.mockResolvedValueOnce(tsconfigWithoutRootDirMockData);

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing rootDir');
  });

  it('should return rootDir and paths', async () => {
    const path = './tsconfig.json';

    stat.mockResolvedValueOnce({} as never);
    readFile.mockResolvedValueOnce(tsconfigMockData);

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await runPromise(validateTsConfig(path));

    expect(result).toMatchSnapshot();
  });
});
