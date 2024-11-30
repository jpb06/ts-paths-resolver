import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { makeFsTestLayer } from '@tests/layers';
import { packageJsonMockData } from '@tests/mock-data';

import { InputError } from '../errors/input.error.js';

describe('validatePackageJson function', () => {
  it('should fail if file does not exist', async () => {
    const path = './package.json';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(false),
    });

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await Effect.runPromise(
      pipe(validatePackageJson(path), Effect.flip, Effect.provide(FsTestLayer)),
    );

    expect(result).toBeInstanceOf(InputError);
    expect((result as InputError).cause).toBe(
      `package.json file not found at ${path}`,
    );
  });

  it('should extract data from package.json', async () => {
    const path = './package.json';

    const { FsTestLayer } = makeFsTestLayer({
      exists: Effect.succeed(true),
      readFileString: Effect.succeed(packageJsonMockData),
    });

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await runPromise(
      pipe(validatePackageJson(path), Effect.provide(FsTestLayer)),
    );

    expect(result).toMatchSnapshot();
  });
});
