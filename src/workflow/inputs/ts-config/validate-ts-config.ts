import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { readJsonEffect } from '@dependencies/fs/index.js';

import { InputError } from '../errors/input.error.js';
import { InvalidTsConfigFileError } from './invalid-ts-config.error.js';

type MaybeTsConfigWithPaths = {
  compilerOptions?: {
    rootDir?: string;
    paths?: Record<string, string[]>;
  };
};

export type TsConfig = {
  tsPathAliases: Record<string, string[]>;
  rootDir: string;
};

export const validateTsConfig = (tsconfigPath: string) =>
  pipe(
    Effect.gen(function* () {
      const fs = yield* FileSystem;
      const tsConfigExists = yield* fs.exists(tsconfigPath);
      if (!tsConfigExists) {
        return yield* Effect.fail(
          new InputError({
            cause: `tsconfig.json file not found at ${tsconfigPath}`,
          }),
        );
      }

      const tsConfig =
        yield* readJsonEffect<MaybeTsConfigWithPaths>(tsconfigPath);

      const tsPathAliases = tsConfig.compilerOptions?.paths;
      if (!tsPathAliases) {
        return yield* new InvalidTsConfigFileError({
          message: 'Missing paths',
        });
      }

      const rootDir = tsConfig.compilerOptions?.rootDir;
      if (!rootDir) {
        return yield* new InvalidTsConfigFileError({
          message: 'Missing rootDir',
        });
      }

      return { tsPathAliases, rootDir };
    }),
    Effect.withSpan('validate-ts-config'),
  );
