"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTsPaths = void 0;
const effect_1 = require("effect");
const console_js_1 = require("@dependencies/console/console.js");
const _inputs_1 = require("@inputs");
const get_files_by_entry_point_js_1 = require("./logic/get-files-by-entry-point.js");
const transform_file_dependencies_js_1 = require("./logic/transform-imports/transform-file-dependencies.js");
const resolveTsPaths = ({ distPath, tsconfigPath, packageJsonPath, }) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const [tsConfig, entryPoints] = yield* effect_1.Effect.all([(0, _inputs_1.validateTsConfig)(tsconfigPath), (0, _inputs_1.validatePackageJson)(packageJsonPath)], { concurrency: 'unbounded' });
    const filesByEntryPoint = yield* (0, get_files_by_entry_point_js_1.getFilesByEntryPoint)(distPath, entryPoints);
    const alteredFiles = yield* (0, transform_file_dependencies_js_1.transformFileDependencies)(distPath, tsConfig, filesByEntryPoint);
    (0, console_js_1.displaySuccess)(alteredFiles.length);
}), effect_1.Effect.withSpan('resolve-ts-paths'));
exports.resolveTsPaths = resolveTsPaths;
//# sourceMappingURL=resolve-ts-paths.workflow.js.map