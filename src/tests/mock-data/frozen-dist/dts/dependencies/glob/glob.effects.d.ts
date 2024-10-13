import { Effect } from 'effect';
import { GlobError } from './glob.error.js';
export declare const globEffect: (path: string, pattern: string | string[]) => Effect.Effect<string[], GlobError, never>;
