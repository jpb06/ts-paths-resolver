import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, pipe } from 'effect';

import { transformFileAliases } from './file-aliases/transform-file-aliases.js';
import type {
  PathsAliasesEntries,
  TransformPathAliasesInFileArgs,
} from './types.js';
import { transformWildcardAliases } from './wildcard-aliases/transform-wildcard-aliases.js';

export const transformPathAliasesInFile =
  (args: TransformPathAliasesInFileArgs) =>
  (pathsAliases: PathsAliasesEntries) =>
    pipe(
      Effect.gen(function* () {
        const fs = yield* FileSystem;

        const fileContent = yield* fs.readFileString(
          `${args.distPath}/${args.sourceFilePath}`,
        );

        const isWildcardPath = pathsAliases[1][0].endsWith('/*');
        if (isWildcardPath) {
          return yield* transformWildcardAliases(
            args,
            pathsAliases,
            fileContent,
          );
        }

        return yield* transformFileAliases(args, pathsAliases, fileContent);
      }),
      Effect.withSpan('transform-path-aliases-in-file', {
        attributes: {
          args: JSON.stringify(args),
          pathsAliases,
        },
      }),
    );
