"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPathAliasesInFile = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const transform_file_aliases_js_1 = require("./file-aliases/transform-file-aliases.js");
const transform_wildcard_aliases_js_1 = require("./wildcard-aliases/transform-wildcard-aliases.js");
const transformPathAliasesInFile = (args) => (pathsAliases) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const fileContent = yield* (0, index_js_1.readFileAsStringEffect)(`${args.distPath}/${args.sourceFilePath}`);
    const isWildcardPath = pathsAliases[1][0].endsWith('/*');
    if (isWildcardPath) {
        return yield* (0, transform_wildcard_aliases_js_1.transformWildcardAliases)(args, pathsAliases, fileContent);
    }
    return yield* (0, transform_file_aliases_js_1.transformFileAliases)(args, pathsAliases, fileContent);
}), effect_1.Effect.withSpan('transform-path-aliases-in-file', {
    attributes: {
        args: JSON.stringify(args),
        pathsAliases,
    },
}));
exports.transformPathAliasesInFile = transformPathAliasesInFile;
//# sourceMappingURL=transform-path-aliases-in-file.js.map