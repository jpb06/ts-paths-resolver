import { Effect, pipe } from 'effect';

import { writeFileEffect } from '@dependencies/fs/index.js';
import { dynamicImportPathRegex, importPathRegex } from '@regex';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
import type {
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from '../types.js';

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
      let updatedFileContent = fileContent;
      const writePath = `${distPath}/${sourceFilePath}`;

      const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
      const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);

      const importMatch = fileContent.match(
        importPathRegex(aliasWithoutEndWildcard),
      );
      if (importMatch) {
        const fullPath = importMatch[1];
        const subPath = importMatch[2];

        const resolvedPath = resolveFullPath(
          rootDir,
          entryPoint,
          `./${sourceFilePath}`,
          `${targetWithoutEndWildcard}${subPath}`,
        );

        updatedFileContent = fileContent.replace(fullPath, resolvedPath);
        yield* writeFileEffect(writePath, updatedFileContent);
      }

      const dynamicImportMatch = fileContent.match(
        dynamicImportPathRegex(aliasWithoutEndWildcard),
      );
      if (dynamicImportMatch) {
        const fullPath = dynamicImportMatch[1];
        const subPath = dynamicImportMatch[2];

        const resolvedPath = resolveFullPath(
          rootDir,
          entryPoint,
          `./${sourceFilePath}`,
          `${targetWithoutEndWildcard}${subPath}`,
        );

        updatedFileContent = fileContent.replace(fullPath, resolvedPath);
        yield* writeFileEffect(writePath, updatedFileContent);
      }

      const noMatch = importMatch === null && dynamicImportMatch === null;
      if (noMatch) {
        return undefined;
      }

      return writePath;
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
