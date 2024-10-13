import { Effect } from 'effect';
export type ResolveTsPathsArgs = {
    distPath: string;
    tsconfigPath: string;
    packageJsonPath: string;
};
export declare const resolveTsPaths: ({ distPath, tsconfigPath, packageJsonPath, }: ResolveTsPathsArgs) => Effect.Effect<void, import("../dependencies/fs/fs.error.js").FsError | import("../dependencies/glob/glob.error.js").GlobError | import("./inputs/ts-config/invalid-ts-config.error.js").InvalidTsConfigFileError, never>;
