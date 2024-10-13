import { Effect, pipe } from 'effect';

import {
  FsError,
  existsEffect,
  readJsonEffect,
} from '@dependencies/fs/index.js';

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
      const tsConfigExists = yield* existsEffect(tsconfigPath);
      if (!tsConfigExists) {
        return yield* Effect.fail(
          new FsError({
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
