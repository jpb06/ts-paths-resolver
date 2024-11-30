import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { makeFsTestLayer } from '@tests/layers';
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

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(false),
    });

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip, Effect.provide(FsTestLayer)),
    );

    expect(result).toBeInstanceOf(InputError);
    expect((result as InputError).cause).toBe(
      `tsconfig.json file not found at ${path}`,
    );
  });

  it('should fail is tsconfig has no paths', async () => {
    const path = './tsconfig.json';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: Effect.succeed(tsconfigWithoutPathsMockData),
    });

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip, Effect.provide(FsTestLayer)),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing paths');
  });

  it('should fail is tsconfig has no root dir', async () => {
    const path = './tsconfig.json';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: Effect.succeed(tsconfigWithoutRootDirMockData),
    });

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await Effect.runPromise(
      pipe(validateTsConfig(path), Effect.flip, Effect.provide(FsTestLayer)),
    );

    expect(result).toBeInstanceOf(InvalidTsConfigFileError);
    expect(result.message).toBe('Missing rootDir');
  });

  it('should return rootDir and paths', async () => {
    const path = './tsconfig.json';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: Effect.succeed(tsconfigMockData),
    });

    const { validateTsConfig } = await import('./validate-ts-config.js');

    const result = await runPromise(
      pipe(validateTsConfig(path), Effect.provide(FsTestLayer)),
    );

    expect(result).toMatchSnapshot();
  });
});
