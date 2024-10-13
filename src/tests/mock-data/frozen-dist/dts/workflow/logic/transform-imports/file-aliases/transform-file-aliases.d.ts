import { Effect } from 'effect';
import type { PathsAliasesEntries, TransformPathAliasesInFileArgs } from '../types.js';
export declare const transformFileAliases: (args: TransformPathAliasesInFileArgs, pathsAliases: PathsAliasesEntries, fileContent: string) => Effect.Effect<string[], import("@dependencies/fs/index.js").FsError, never>;
