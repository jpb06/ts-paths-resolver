import { Effect, pipe } from 'effect';

import type {
  FileTransformResolution,
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from '../types.js';
import { transformImportStatements } from './transform-import-statements.js';
import { transformRequireStatements } from './transform-require-statements.js';

export const transformWildcardAliases = (
  args: TransformPathAliasesInFileArgs,
  pathsAliases: PathsAliasesEntries,
  fileContent: string,
) =>
  pipe(
    Effect.gen(function* () {
      const fileResolutions: FileTransformResolution = {
        filePath: `${args.distPath}/${args.sourceFilePath}`,
        resolutions: [],
      };

      const aliasInFile = fileContent.includes(pathsAliases[0].slice(0, -1));
      if (!aliasInFile) {
        return fileResolutions;
      }

      const resolutions = yield* Effect.all([
        transformRequireStatements(args, pathsAliases, fileContent),
        transformImportStatements(args, pathsAliases, fileContent),
      ]);

      fileResolutions.resolutions = resolutions.flat();
      return fileResolutions;
    }),
    Effect.withSpan('transform-wildcard-aliases', {
      attributes: {
        args: JSON.stringify(args),
        pathsAliases,
        fileContent,
      },
    }),
  );
