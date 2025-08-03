import { Effect, pipe } from 'effect';

import {
  displayAlterations,
  displaySuccess,
} from '@dependencies/console/console.js';
import { validatePackageJson, validateTsConfig } from '@inputs';

import { getFilesByEntryPoint } from './logic/get-files-by-entry-point.js';
import { regroupByFile } from './logic/regroup-by-file.js';
import { transformFileDependencies } from './logic/transform-imports/transform-file-dependencies.js';

export type ResolveTsPathsArgs = {
  path: string;
  tsconfigPath: string;
  debug: boolean;
};

export const resolveTsPathsEffect = ({
  path,
  tsconfigPath,
  debug,
}: ResolveTsPathsArgs) =>
  pipe(
    Effect.gen(function* () {
      const packageJsonPath = `./${path}/package.json`;

      const [tsConfig, entryPoints] = yield* Effect.all(
        [validateTsConfig(tsconfigPath), validatePackageJson(packageJsonPath)],
        { concurrency: 'unbounded' },
      );

      const filesByEntryPoint = yield* getFilesByEntryPoint(path, entryPoints);
      const alteredFiles = yield* transformFileDependencies(
        path,
        tsConfig,
        filesByEntryPoint,
      );

      const byFile = regroupByFile(alteredFiles);

      yield* displaySuccess(
        byFile.length,
        byFile.flatMap((d) => d.resolutions).length,
      );

      if (debug) {
        yield* displayAlterations(byFile);
      }
    }),
    Effect.withSpan('resolve-ts-paths', {
      attributes: { path, tsconfigPath, debug },
    }),
  );
