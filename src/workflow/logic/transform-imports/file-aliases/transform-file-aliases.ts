import { Effect, pipe } from 'effect';

import { writeFileEffect } from '@dependencies/fs/index.js';
import {
  commonjsRequireRegex,
  esmDynamicImportRegex,
  esmImportRegex,
} from '@regex';

import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
import type {
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

      if (!requireMatch && !importMatch && !dynamicImportMatch) {
        return [];
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

      const writePath = `${args.distPath}/${args.sourceFilePath}`;
      yield* writeFileEffect(
        `${args.distPath}/${args.sourceFilePath}`,
        fileContentWithTransformedPaths,
      );
      return [writePath];
    }),
    Effect.withSpan('transform-file-aliases'),
  );
