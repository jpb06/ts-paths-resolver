export const transpiledDtsMockData = `import { Effect } from 'effect';
import { requirePathRegex } from '@regex';
import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';
export declare const transformPathAliasesInFile: (args: TransformPathAliasesInFileArgs) => (pathsAliases: PathsAliasesEntries) => Effect.Effect<(string | undefined)[], import("@dependencies/fs/index.js").FsError, never>;`;
