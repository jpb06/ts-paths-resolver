import { Effect, pipe } from 'effect';
import { distinct } from '../distinct.js';
import { transformPathAliasesInFile } from './transform-path-aliases-in-file.js';
const forEachSourceFile = (distPath, entryPoint, tsConfig) => (sourceFilePath) => Effect.forEach(Object.entries(tsConfig.tsPathAliases), transformPathAliasesInFile({
    distPath,
    rootDir: tsConfig.rootDir,
    sourceFilePath,
    entryPoint,
}));
const forEachEntryPoint = (distPath, tsConfig) => ({ entryPoint, files }) => Effect.forEach(files, forEachSourceFile(distPath, entryPoint, tsConfig), {
    concurrency: 'unbounded',
});
export const transformFileDependencies = (distPath, tsConfig, filesByEntryPoint) => pipe(Effect.forEach(filesByEntryPoint, forEachEntryPoint(distPath, tsConfig), {
    concurrency: 'unbounded',
}), Effect.map((files) => distinct(files.flat(4))), Effect.withSpan('transform-file-dependencies', {
    attributes: {
        distPath,
        tsConfig: JSON.stringify(tsConfig),
        filesByEntryPoint: JSON.stringify(filesByEntryPoint),
    },
}));
//# sourceMappingURL=transform-file-dependencies.js.map