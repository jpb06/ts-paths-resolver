import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';

export const replaceImports = (
  rootDir: string,
  entryPoint: string,
  sourceFilePath: string,
  targetWithoutEndWildcard: string,
  fileContent: string,
  writePath: string,
  regex: RegExp,
) =>
  pipe(
    Effect.gen(function* () {
      const importMatches = Array.from(fileContent.matchAll(regex));
      const hasNoMatches = importMatches.length === 0;
      if (hasNoMatches) {
        return false;
      }

      let data = fileContent;
      const fs = yield* FileSystem;

      for (const match of importMatches) {
        const fullPath = match[1];
        const subPath = match[2];

        const resolvedPath = resolveFullPath(
          rootDir,
          entryPoint,
          `./${sourceFilePath}`,
          `${targetWithoutEndWildcard}${subPath}`,
        );

        data = data.replaceAll(fullPath, resolvedPath);
      }

      yield* fs.writeFileString(writePath, data);

      return true;
    }),
    Effect.withSpan('', {
      attributes: {
        rootDir,
        entryPoint,
        sourceFilePath,
        targetWithoutEndWildcard,
        fileContent,
        writePath,
        regex,
      },
    }),
  );
