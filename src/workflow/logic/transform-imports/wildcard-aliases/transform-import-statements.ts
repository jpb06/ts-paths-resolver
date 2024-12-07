import { Effect, pipe } from 'effect';

import { dynamicImportPathRegex, importPathRegex } from '@regex';

import type {
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
        return;
      }

      const writePath = `${distPath}/${sourceFilePath}`;

      const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
      const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);

      const importsReplaced = yield* replaceImports(
        rootDir,
        entryPoint,
        sourceFilePath,
        targetWithoutEndWildcard,
        fileContent,
        writePath,
        new RegExp(importPathRegex(aliasWithoutEndWildcard), 'g'),
      );
      const dynamicImportsReplaced = yield* replaceImports(
        rootDir,
        entryPoint,
        sourceFilePath,
        targetWithoutEndWildcard,
        fileContent,
        writePath,
        new RegExp(dynamicImportPathRegex(aliasWithoutEndWildcard), 'g'),
      );

      const match = importsReplaced || dynamicImportsReplaced;
      if (match) {
        return writePath;
      }

      return undefined;
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
