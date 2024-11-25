import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { requirePathRegex } from '@regex';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
import type {
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
      const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);

      const requireMatch = fileContent.match(
        requirePathRegex(aliasWithoutEndWildcard),
      );
      if (!requireMatch) {
        return undefined;
      }

      const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);
      const fullPath = requireMatch[0];
      const subPath = requireMatch[1];
      const resolvedPath = resolveFullPath(
        rootDir,
        entryPoint,
        `./${sourceFilePath}`,
        `${targetWithoutEndWildcard}${subPath}`,
      );

      const fileContentWithTransformedPaths = fileContent.replace(
        fullPath,
        `require("${resolvedPath}")`,
      );
      const writePath = `${distPath}/${sourceFilePath}`;
      const fs = yield* FileSystem;
      yield* fs.writeFileString(writePath, fileContentWithTransformedPaths);

      return writePath;
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
