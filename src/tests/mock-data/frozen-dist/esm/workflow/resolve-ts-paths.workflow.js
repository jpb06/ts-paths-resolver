import { Effect, pipe } from 'effect';
import { displaySuccess } from '@dependencies/console/console.js';
import { validatePackageJson, validateTsConfig } from '@inputs';
import { getFilesByEntryPoint } from './logic/get-files-by-entry-point.js';
import { transformFileDependencies } from './logic/transform-imports/transform-file-dependencies.js';
export const resolveTsPaths = ({ distPath, tsconfigPath, packageJsonPath, }) => pipe(Effect.gen(function* () {
    const [tsConfig, entryPoints] = yield* Effect.all([validateTsConfig(tsconfigPath), validatePackageJson(packageJsonPath)], { concurrency: 'unbounded' });
    const filesByEntryPoint = yield* getFilesByEntryPoint(distPath, entryPoints);
    const alteredFiles = yield* transformFileDependencies(distPath, tsConfig, filesByEntryPoint);
    displaySuccess(alteredFiles.length);
}), Effect.withSpan('resolve-ts-paths'));
//# sourceMappingURL=resolve-ts-paths.workflow.js.map