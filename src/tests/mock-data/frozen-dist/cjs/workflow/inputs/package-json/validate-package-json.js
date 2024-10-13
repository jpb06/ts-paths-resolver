"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePackageJson = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const get_entry_point_js_1 = require("./get-entry-point.js");
const validatePackageJson = (packageJsonPath) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const packageJsonExists = yield* (0, index_js_1.existsEffect)(packageJsonPath);
    if (!packageJsonExists) {
        return yield* effect_1.Effect.fail(new index_js_1.FsError({
            cause: `package.json file not found at ${packageJsonPath}`,
        }));
    }
    const data = yield* (0, index_js_1.readJsonEffect)(packageJsonPath);
    const cjsEntryPoint = (0, get_entry_point_js_1.getEntryPointFor)('cjs', data);
    const esmEntryPoint = (0, get_entry_point_js_1.getEntryPointFor)('esm', data);
    const dtsEntryPoint = (0, get_entry_point_js_1.getEntryPointFor)('types', data);
    return {
        cjsEntryPoint,
        esmEntryPoint,
        dtsEntryPoint,
    };
}), effect_1.Effect.withSpan('validate-package-json'));
exports.validatePackageJson = validatePackageJson;
//# sourceMappingURL=validate-package-json.js.map