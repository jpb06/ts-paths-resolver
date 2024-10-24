import { Effect, pipe } from 'effect';

import type { TsConfig } from '../../inputs/index.js';
import { distinct } from '../distinct.js';
import type { FilesByEntryPoint } from '../get-files-by-entry-point.js';
import { transformPathAliasesInFile } from './transform-path-aliases-in-file.js';

const forEachSourceFile =
  (distPath: string, entryPoint: string, tsConfig: TsConfig) =>
  (sourceFilePath: string) =>
    Effect.forEach(
      Object.entries(tsConfig.tsPathAliases),
      transformPathAliasesInFile({
        distPath,
        rootDir: tsConfig.rootDir,
        sourceFilePath,
        entryPoint,
      }),
    );

const forEachEntryPoint =
  (distPath: string, tsConfig: TsConfig) =>
  ({ entryPoint, files }: FilesByEntryPoint[number]) =>
    Effect.forEach(files, forEachSourceFile(distPath, entryPoint, tsConfig), {
      concurrency: 'unbounded',
    });

export const transformFileDependencies = (
  distPath: string,
  tsConfig: TsConfig,
  filesByEntryPoint: FilesByEntryPoint,
) =>
  pipe(
    Effect.forEach(filesByEntryPoint, forEachEntryPoint(distPath, tsConfig), {
      concurrency: 'unbounded',
    }),
    Effect.map((files) => distinct(files.flat(4))),
    Effect.withSpan('transform-file-dependencies', {
      attributes: {
        distPath,
        tsConfig: JSON.stringify(tsConfig),
        filesByEntryPoint: JSON.stringify(filesByEntryPoint),
      },
    }),
  );
