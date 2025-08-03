import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { requirePathRegex } from '@regex';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
import type {
  PathResolution,
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from '../types.js';

export const transformRequireStatements = (
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

      const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
      const requireMatches = [
        ...fileContent.matchAll(
          new RegExp(requirePathRegex(aliasWithoutEndWildcard), 'g'),
        ),
      ];
      if (requireMatches.length === 0) {
        return [];
      }

      const fs = yield* FileSystem;
      const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);
      const resolutions: PathResolution[] = [];
      const fileContentWithTransformedPaths = requireMatches.reduce(
        (alteredFileContent, match) => {
          const fullPath = match[0];
          const subPath = match[1];

          const resolvedPath = resolveFullPath(
            rootDir,
            entryPoint,
            `./${sourceFilePath}`,
            `${targetWithoutEndWildcard}${subPath}`,
          );

          resolutions.push({
            alias: pathsAliases[0],
            resolvedPath,
          });
          return alteredFileContent.replace(
            fullPath,
            `require("${resolvedPath}")`,
          );
        },
        fileContent,
      );

      const writePath = `${distPath}/${sourceFilePath}`;
      yield* fs.writeFileString(writePath, fileContentWithTransformedPaths);

      return resolutions;
    }),
    Effect.withSpan('transform-require-statements', {
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
