"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformRequireStatements = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const _regex_1 = require("@regex");
const resolve_full_path_js_1 = require("../../resolve-path/resolve-full-path.js");
const transformRequireStatements = ({ distPath, rootDir, sourceFilePath, entryPoint, }, pathsAliases, fileContent) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
    const requireMatch = fileContent.match((0, _regex_1.requirePathRegex)(aliasWithoutEndWildcard));
    if (!requireMatch) {
        return undefined;
    }
    const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);
    const fullPath = requireMatch[0];
    const subPath = requireMatch[1];
    const resolvedPath = (0, resolve_full_path_js_1.resolveFullPath)(rootDir, entryPoint, `./${sourceFilePath}`, `${targetWithoutEndWildcard}${subPath}`);
    const fileContentWithTransformedPaths = fileContent.replace(fullPath, `require("${resolvedPath}")`);
    const writePath = `${distPath}/${sourceFilePath}`;
    yield* (0, index_js_1.writeFileEffect)(writePath, fileContentWithTransformedPaths);
    return writePath;
}), effect_1.Effect.withSpan('transform-require-statements', {
    attributes: {
        distPath,
        rootDir,
        sourceFilePath,
        entryPoint,
        pathsAliases,
        fileContent,
    },
}));
exports.transformRequireStatements = transformRequireStatements;
//# sourceMappingURL=transform-require-statements.js.map