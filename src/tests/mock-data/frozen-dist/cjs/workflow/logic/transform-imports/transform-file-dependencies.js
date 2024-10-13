"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFileDependencies = void 0;
const effect_1 = require("effect");
const distinct_js_1 = require("../distinct.js");
const transform_path_aliases_in_file_js_1 = require("./transform-path-aliases-in-file.js");
const forEachSourceFile = (distPath, entryPoint, tsConfig) => (sourceFilePath) => effect_1.Effect.forEach(Object.entries(tsConfig.tsPathAliases), (0, transform_path_aliases_in_file_js_1.transformPathAliasesInFile)({
    distPath,
    rootDir: tsConfig.rootDir,
    sourceFilePath,
    entryPoint,
}));
const forEachEntryPoint = (distPath, tsConfig) => ({ entryPoint, files }) => effect_1.Effect.forEach(files, forEachSourceFile(distPath, entryPoint, tsConfig), {
    concurrency: 'unbounded',
});
const transformFileDependencies = (distPath, tsConfig, filesByEntryPoint) => (0, effect_1.pipe)(effect_1.Effect.forEach(filesByEntryPoint, forEachEntryPoint(distPath, tsConfig), {
    concurrency: 'unbounded',
}), effect_1.Effect.map((files) => (0, distinct_js_1.distinct)(files.flat(4))), effect_1.Effect.withSpan('transform-file-dependencies', {
    attributes: {
        distPath,
        tsConfig: JSON.stringify(tsConfig),
        filesByEntryPoint: JSON.stringify(filesByEntryPoint),
    },
}));
exports.transformFileDependencies = transformFileDependencies;
//# sourceMappingURL=transform-file-dependencies.js.map