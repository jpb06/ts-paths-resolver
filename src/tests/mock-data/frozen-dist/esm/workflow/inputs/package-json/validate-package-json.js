import { Effect, pipe } from 'effect';
import { FsError, existsEffect, readJsonEffect, } from '@dependencies/fs/index.js';
import { getEntryPointFor } from './get-entry-point.js';
export const validatePackageJson = (packageJsonPath) => pipe(Effect.gen(function* () {
    const packageJsonExists = yield* existsEffect(packageJsonPath);
    if (!packageJsonExists) {
        return yield* Effect.fail(new FsError({
            cause: `package.json file not found at ${packageJsonPath}`,
        }));
    }
    const data = yield* readJsonEffect(packageJsonPath);
    const cjsEntryPoint = getEntryPointFor('cjs', data);
    const esmEntryPoint = getEntryPointFor('esm', data);
    const dtsEntryPoint = getEntryPointFor('types', data);
    return {
        cjsEntryPoint,
        esmEntryPoint,
        dtsEntryPoint,
    };
}), Effect.withSpan('validate-package-json'));
//# sourceMappingURL=validate-package-json.js.map