import { Effect } from 'effect';
import type { EffectResultSuccess } from '../../types/effect.types.js';
import type { EntryPoints } from '../inputs/index.js';
export type FilesByEntryPoint = EffectResultSuccess<typeof getFilesByEntryPoint>;
export declare const getFilesByEntryPoint: (distPath: string, entryPoints: EntryPoints) => Effect.Effect<{
    entryPoint: string;
    files: string[];
}[], import("@dependencies/glob/index.js").GlobError, never>;
