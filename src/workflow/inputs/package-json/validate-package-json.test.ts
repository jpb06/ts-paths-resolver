import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { packageJsonMockData } from '@tests/mock-data';

import { InputError } from '../errors/input.error.js';

describe('validatePackageJson function', () => {
  it('should fail if file does not exist', async () => {
    const path = './package.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(false),
      } as unknown as FileSystem),
    );

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await Effect.runPromise(
      pipe(
        validatePackageJson(path),
        Effect.flip,
        Effect.provide(TestFileSystemlayer),
      ),
    );

    expect(result).toBeInstanceOf(InputError);
    expect((result as InputError).cause).toBe(
      `package.json file not found at ${path}`,
    );
  });

  it('should extract data from package.json', async () => {
    const path = './package.json';

    const TestFileSystemlayer = Layer.succeed(
      FileSystem,
      FileSystem.of({
        exists: () => Effect.succeed(true),
        readFileString: () => Effect.succeed(packageJsonMockData),
      } as unknown as FileSystem),
    );

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await runPromise(
      pipe(validatePackageJson(path), Effect.provide(TestFileSystemlayer)),
    );

    expect(result).toMatchSnapshot();
  });
});
