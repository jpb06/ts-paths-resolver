import { Effect } from 'effect';
import { FsError } from '@dependencies/fs/index.js';
export type EntryPoints = {
    cjsEntryPoint: string | undefined;
    esmEntryPoint: string | undefined;
    dtsEntryPoint: string | undefined;
};
export declare const validatePackageJson: (packageJsonPath: string) => Effect.Effect<{
    cjsEntryPoint: string | undefined;
    esmEntryPoint: string | undefined;
    dtsEntryPoint: string | undefined;
}, FsError, never>;
