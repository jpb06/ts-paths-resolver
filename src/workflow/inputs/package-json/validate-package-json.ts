import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { readJsonEffect } from '@dependencies/fs/index.js';

import { InputError } from '../errors/input.error.js';
import { getEntryPointFor } from './get-entry-point.js';
import type { MaybePackageJsonWithPaths } from './package-json.types.js';

export type EntryPoints = {
  cjsEntryPoint: string | undefined;
  esmEntryPoint: string | undefined;
  dtsEntryPoint: string | undefined;
};

export const validatePackageJson = (packageJsonPath: string) =>
  pipe(
    Effect.gen(function* () {
      const fs = yield* FileSystem;
      const packageJsonExists = yield* fs.exists(packageJsonPath);
      if (!packageJsonExists) {
        return yield* Effect.fail(
          new InputError({
            cause: `package.json file not found at ${packageJsonPath}`,
          }),
        );
      }

      const data =
        yield* readJsonEffect<MaybePackageJsonWithPaths>(packageJsonPath);

      const cjsEntryPoint = getEntryPointFor('cjs', data);
      const esmEntryPoint = getEntryPointFor('esm', data);
      const dtsEntryPoint = getEntryPointFor('types', data);

      return {
        cjsEntryPoint,
        esmEntryPoint,
        dtsEntryPoint,
      };
    }),
    Effect.withSpan('validate-package-json'),
  );
