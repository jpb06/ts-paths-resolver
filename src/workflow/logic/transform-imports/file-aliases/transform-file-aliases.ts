import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import {
  commonjsRequireRegex,
  esmDynamicImportRegex,
  esmImportRegex,
} from '@regex';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
import type {
  FileTransformResolution,
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from '../types.js';

export const transformFileAliases = (
  args: TransformPathAliasesInFileArgs,
  pathsAliases: PathsAliasesEntries,
  fileContent: string,
) =>
  pipe(
    Effect.gen(function* () {
      const requireMatch = fileContent.match(
        commonjsRequireRegex(pathsAliases[0]),
      );
      const importMatch = fileContent.match(esmImportRegex(pathsAliases[0]));
      const dynamicImportMatch = fileContent.match(
        esmDynamicImportRegex(pathsAliases[0]),
      );

      const filePath = `${args.distPath}/${args.sourceFilePath}`;
      const fileResolutions: FileTransformResolution = {
        filePath,
        resolutions: [],
      };

      const noMatch =
        requireMatch === null &&
        importMatch === null &&
        dynamicImportMatch === null;
      if (noMatch) {
        return fileResolutions;
      }

      const fullPath = `./${args.sourceFilePath}`;
      const resolvedPath = resolveFullPath(
        args.rootDir,
        args.entryPoint,
        fullPath,
        pathsAliases[0].endsWith('/*') ? pathsAliases[0] : pathsAliases[1][0],
      );

      const fileContentWithTransformedPaths = fileContent
        .replace(
          commonjsRequireRegex(pathsAliases[0]),
          `require("${resolvedPath}")`,
        )
        .replace(esmImportRegex(pathsAliases[0]), `from '${resolvedPath}'`)
        .replace(
          esmDynamicImportRegex(pathsAliases[0]),
          `import('${resolvedPath}')`,
        );

      const fs = yield* FileSystem;
      yield* fs.writeFileString(filePath, fileContentWithTransformedPaths);

      const allMatches = [
        ...(requireMatch ?? []),
        ...(importMatch ?? []),
        ...(dynamicImportMatch ?? []),
      ];
      resolvedPath;

      fileResolutions.resolutions = allMatches.map(() => ({
        alias: pathsAliases[0],
        resolvedPath,
      }));
      return fileResolutions;
    }),
    Effect.withSpan('transform-file-aliases'),
  );
