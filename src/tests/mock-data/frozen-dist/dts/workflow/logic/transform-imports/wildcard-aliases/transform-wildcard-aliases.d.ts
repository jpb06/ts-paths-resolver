import { Effect } from 'effect';
import type { PathsAliasesEntries, TransformPathAliasesInFileArgs } from '../types.js';
export declare const transformWildcardAliases: (args: TransformPathAliasesInFileArgs, pathsAliases: PathsAliasesEntries, fileContent: string) => Effect.Effect<(string | undefined)[], import("../../../../dependencies/fs/fs.error.js").FsError, never>;
