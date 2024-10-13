import { Effect } from 'effect';
import { FsError } from '@dependencies/fs/index.js';
import { InvalidTsConfigFileError } from './invalid-ts-config.error.js';
export type TsConfig = {
    tsPathAliases: Record<string, string[]>;
    rootDir: string;
};
export declare const validateTsConfig: (tsconfigPath: string) => Effect.Effect<{
    tsPathAliases: Record<string, string[]>;
    rootDir: string;
}, FsError | InvalidTsConfigFileError, never>;
