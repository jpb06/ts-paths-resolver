import { Effect } from 'effect';
import type { PathsAliasesEntries, TransformPathAliasesInFileArgs } from './types.js';
export declare const transformPathAliasesInFile: (args: TransformPathAliasesInFileArgs) => (pathsAliases: PathsAliasesEntries) => Effect.Effect<(string | undefined)[], import("@dependencies/fs/index.js").FsError, never>;
