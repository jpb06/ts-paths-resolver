"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTsConfig = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const invalid_ts_config_error_js_1 = require("./invalid-ts-config.error.js");
const validateTsConfig = (tsconfigPath) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const tsConfigExists = yield* (0, index_js_1.existsEffect)(tsconfigPath);
    if (!tsConfigExists) {
        return yield* effect_1.Effect.fail(new index_js_1.FsError({
            cause: `tsconfig.json file not found at ${tsconfigPath}`,
        }));
    }
    const tsConfig = yield* (0, index_js_1.readJsonEffect)(tsconfigPath);
    const tsPathAliases = tsConfig.compilerOptions?.paths;
    if (!tsPathAliases) {
        return yield* new invalid_ts_config_error_js_1.InvalidTsConfigFileError({
            message: 'Missing paths',
        });
    }
    const rootDir = tsConfig.compilerOptions?.rootDir;
    if (!rootDir) {
        return yield* new invalid_ts_config_error_js_1.InvalidTsConfigFileError({
            message: 'Missing rootDir',
        });
    }
    return { tsPathAliases, rootDir };
}), effect_1.Effect.withSpan('validate-ts-config'));
exports.validateTsConfig = validateTsConfig;
//# sourceMappingURL=validate-ts-config.js.map