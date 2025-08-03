import { Effect, pipe } from 'effect';

import { dynamicImportPathRegex, importPathRegex } from '@regex';

import type {
  PathResolution,
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from '../types.js';
import { replaceImports } from './replace-imports.js';

export const transformImportStatements = (
  {
    distPath,
    rootDir,
    sourceFilePath,
    entryPoint,
  }: TransformPathAliasesInFileArgs,
  pathsAliases: PathsAliasesEntries,
  fileContent: string,
) =>
  pipe(
    Effect.gen(function* () {
      const isFileAlias = pathsAliases[0].endsWith('/*') === false;
      if (isFileAlias) {
        return [];
      }

      const writePath = `${distPath}/${sourceFilePath}`;

      const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
      const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);

      const importsResolvedPaths = yield* replaceImports(
        rootDir,
        entryPoint,
        sourceFilePath,
        targetWithoutEndWildcard,
        fileContent,
        writePath,
        new RegExp(importPathRegex(aliasWithoutEndWildcard), 'g'),
      );
      const dynamicImportsResolvedPaths = yield* replaceImports(
        rootDir,
        entryPoint,
        sourceFilePath,
        targetWithoutEndWildcard,
        fileContent,
        writePath,
        new RegExp(dynamicImportPathRegex(aliasWithoutEndWildcard), 'g'),
      );

      const resolutions: PathResolution[] = [
        ...importsResolvedPaths.map((path) => ({
          alias: pathsAliases[0],
          resolvedPath: path,
        })),
        ...dynamicImportsResolvedPaths.map((path) => ({
          alias: `${pathsAliases[0]} (dynamic import)`,
          resolvedPath: path,
        })),
      ];

      return resolutions;
    }),
    Effect.withSpan('transform-import-statements', {
      attributes: {
        distPath,
        rootDir,
        sourceFilePath,
        entryPoint,
        pathsAliases,
        fileContent,
      },
    }),
  );
