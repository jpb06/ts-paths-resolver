"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformWildcardAliases = void 0;
const effect_1 = require("effect");
const distinct_js_1 = require("../../distinct.js");
const transform_import_statements_js_1 = require("./transform-import-statements.js");
const transform_require_statements_js_1 = require("./transform-require-statements.js");
const transformWildcardAliases = (args, pathsAliases, fileContent) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const aliasInFile = fileContent.includes(pathsAliases[0].slice(0, -1));
    if (!aliasInFile) {
        return [];
    }
    const alteredFiles = yield* effect_1.Effect.all([
        (0, transform_require_statements_js_1.transformRequireStatements)(args, pathsAliases, fileContent),
        (0, transform_import_statements_js_1.transformImportStatements)(args, pathsAliases, fileContent),
    ]);
    return (0, distinct_js_1.distinct)(alteredFiles);
}), effect_1.Effect.withSpan('transform-wildcard-aliases', {
    attributes: {
        args: JSON.stringify(args),
        pathsAliases,
        fileContent,
    },
}));
exports.transformWildcardAliases = transformWildcardAliases;
//# sourceMappingURL=transform-wildcard-aliases.js.map