import { Effect } from 'effect';
import { FsError } from './fs.error.js';
export declare const readFileAsStringEffect: (path: string) => Effect.Effect<string, FsError, never>;
export declare const readFileEffect: (path: string) => Effect.Effect<Buffer, FsError, never>;
export declare const readJsonEffect: <T>(path: string) => Effect.Effect<T, FsError, never>;
export declare const existsEffect: (path: string) => Effect.Effect<boolean, FsError, never>;
export declare const writeFileEffect: (path: string, data: string) => Effect.Effect<void, FsError, never>;
