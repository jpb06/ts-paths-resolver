import { Effect, pipe } from 'effect';
import { FsError, existsEffect, readJsonEffect, } from '@dependencies/fs/index.js';
import { InvalidTsConfigFileError } from './invalid-ts-config.error.js';
export const validateTsConfig = (tsconfigPath) => pipe(Effect.gen(function* () {
    const tsConfigExists = yield* existsEffect(tsconfigPath);
    if (!tsConfigExists) {
        return yield* Effect.fail(new FsError({
            cause: `tsconfig.json file not found at ${tsconfigPath}`,
        }));
    }
    const tsConfig = yield* readJsonEffect(tsconfigPath);
    const tsPathAliases = tsConfig.compilerOptions?.paths;
    if (!tsPathAliases) {
        return yield* new InvalidTsConfigFileError({
            message: 'Missing paths',
        });
    }
    const rootDir = tsConfig.compilerOptions?.rootDir;
    if (!rootDir) {
        return yield* new InvalidTsConfigFileError({
            message: 'Missing rootDir',
        });
    }
    return { tsPathAliases, rootDir };
}), Effect.withSpan('validate-ts-config'));
//# sourceMappingURL=validate-ts-config.js.map