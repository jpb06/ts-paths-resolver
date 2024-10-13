import { Effect } from 'effect';
import type { PathsAliasesEntries, TransformPathAliasesInFileArgs } from '../types.js';
export declare const transformImportStatements: ({ distPath, rootDir, sourceFilePath, entryPoint, }: TransformPathAliasesInFileArgs, pathsAliases: PathsAliasesEntries, fileContent: string) => Effect.Effect<string | undefined, import("@dependencies/fs/index.js").FsError, never>;
