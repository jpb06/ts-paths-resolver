import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import {
  tsconfigMockData,
  tsconfigWithoutPathsMockData,
  tsconfigWithoutRootDirMockData,
} from '@tests/mock-data';

import { InputError } from '../errors/input.error.js';
import { InvalidTsConfigFileError } from './invalid-ts-config.error.js';

describe('validateTsConfig function', () => {
  it('should fail is file does not exist', async () => {
    const path = './tsconfig.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(false),
      } as unknown as FileSystem),
    );

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(
        validateTsConfig(path),
        Effect.flip,
        Effect.provide(TestFileSystemlayer),
      ),
    );

    expect(result).toBeInstanceOf(InputError);
    expect((result as InputError).cause).toBe(
      `tsconfig.json file not found at ${path}`,
    );
  });

  it('should fail is tsconfig has no paths', async () => {
    const path = './tsconfig.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(true),
        readFileString: () => Effect.succeed(tsconfigWithoutPathsMockData),
      } as unknown as FileSystem),
    );

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(
        validateTsConfig(path),
        Effect.flip,
        Effect.provide(TestFileSystemlayer),
      ),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing paths');
  });

  it('should fail is tsconfig has no root dir', async () => {
    const path = './tsconfig.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(true),
        readFileString: () => Effect.succeed(tsconfigWithoutRootDirMockData),
      } as unknown as FileSystem),
    );

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(
        validateTsConfig(path),
        Effect.flip,
        Effect.provide(TestFileSystemlayer),
      ),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing rootDir');
  });

  it('should return rootDir and paths', async () => {
    const path = './tsconfig.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(true),
        readFileString: () => Effect.succeed(tsconfigMockData),
      } as unknown as FileSystem),
    );

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await runPromise(
      pipe(validateTsConfig(path), Effect.provide(TestFileSystemlayer)),
    );

    expect(result).toMatchSnapshot();
  });
});
