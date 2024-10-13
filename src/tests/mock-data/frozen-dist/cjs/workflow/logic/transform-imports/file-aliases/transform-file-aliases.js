"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFileAliases = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const _regex_1 = require("@regex");
const resolve_full_path_js_1 = require("../../resolve-path/resolve-full-path.js");
const transformFileAliases = (args, pathsAliases, fileContent) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    const requireMatch = fileContent.match((0, _regex_1.commonjsRequireRegex)(pathsAliases[0]));
    const importMatch = fileContent.match((0, _regex_1.esmImportRegex)(pathsAliases[0]));
    const dynamicImportMatch = fileContent.match((0, _regex_1.esmDynamicImportRegex)(pathsAliases[0]));
    if (!requireMatch && !importMatch && !dynamicImportMatch) {
        return [];
    }
    const fullPath = `./${args.sourceFilePath}`;
    const resolvedPath = (0, resolve_full_path_js_1.resolveFullPath)(args.rootDir, args.entryPoint, fullPath, pathsAliases[0].endsWith('/*') ? pathsAliases[0] : pathsAliases[1][0]);
    const fileContentWithTransformedPaths = fileContent
        .replace((0, _regex_1.commonjsRequireRegex)(pathsAliases[0]), `require("${resolvedPath}")`)
        .replace((0, _regex_1.esmImportRegex)(pathsAliases[0]), `from '${resolvedPath}'`)
        .replace((0, _regex_1.esmDynamicImportRegex)(pathsAliases[0]), `import('${resolvedPath}')`);
    const writePath = `${args.distPath}/${args.sourceFilePath}`;
    yield* (0, index_js_1.writeFileEffect)(`${args.distPath}/${args.sourceFilePath}`, fileContentWithTransformedPaths);
    return [writePath];
}), effect_1.Effect.withSpan('transform-file-aliases'));
exports.transformFileAliases = transformFileAliases;
//# sourceMappingURL=transform-file-aliases.js.map