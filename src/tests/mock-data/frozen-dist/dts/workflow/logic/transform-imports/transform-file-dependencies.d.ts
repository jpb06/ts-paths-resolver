import { Effect } from 'effect';
import type { TsConfig } from '../../inputs/index.js';
import type { FilesByEntryPoint } from '../get-files-by-entry-point.js';
export declare const transformFileDependencies: (distPath: string, tsConfig: TsConfig, filesByEntryPoint: FilesByEntryPoint) => Effect.Effect<(string | undefined)[], import("../../../dependencies/fs/fs.error.js").FsError, never>;
