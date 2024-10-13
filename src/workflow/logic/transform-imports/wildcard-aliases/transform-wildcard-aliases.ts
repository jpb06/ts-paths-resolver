import { Effect, pipe } from 'effect';

import { distinct } from '../../distinct.js';
import type {
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
      const aliasInFile = fileContent.includes(pathsAliases[0].slice(0, -1));
      if (!aliasInFile) {
        return [];
      }

      const alteredFiles = yield* Effect.all([
        transformRequireStatements(args, pathsAliases, fileContent),
        transformImportStatements(args, pathsAliases, fileContent),
      ]);

      return distinct(alteredFiles);
    }),
    Effect.withSpan('transform-wildcard-aliases', {
      attributes: {
        args: JSON.stringify(args),
        pathsAliases,
        fileContent,
      },
    }),
  );
