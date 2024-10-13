"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformImportStatements = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/fs/index.js");
const _regex_1 = require("@regex");
const resolve_full_path_js_1 = require("../../resolve-path/resolve-full-path.js");
const transformImportStatements = ({ distPath, rootDir, sourceFilePath, entryPoint, }, pathsAliases, fileContent) => (0, effect_1.pipe)(effect_1.Effect.gen(function* () {
    let updatedFileContent = fileContent;
    const writePath = `${distPath}/${sourceFilePath}`;
    const aliasWithoutEndWildcard = pathsAliases[0].slice(0, -1);
    const targetWithoutEndWildcard = pathsAliases[1][0].slice(0, -1);
    const importMatch = fileContent.match((0, _regex_1.importPathRegex)(aliasWithoutEndWildcard));
    if (importMatch) {
        const fullPath = importMatch[1];
        const subPath = importMatch[2];
        const resolvedPath = (0, resolve_full_path_js_1.resolveFullPath)(rootDir, entryPoint, `./${sourceFilePath}`, `${targetWithoutEndWildcard}${subPath}`);
        updatedFileContent = fileContent.replace(fullPath, resolvedPath);
        yield* (0, index_js_1.writeFileEffect)(writePath, updatedFileContent);
    }
    const dynamicImportMatch = fileContent.match((0, _regex_1.dynamicImportPathRegex)(aliasWithoutEndWildcard));
    if (dynamicImportMatch) {
        const fullPath = dynamicImportMatch[1];
        const subPath = dynamicImportMatch[2];
        const resolvedPath = (0, resolve_full_path_js_1.resolveFullPath)(rootDir, entryPoint, `./${sourceFilePath}`, `${targetWithoutEndWildcard}${subPath}`);
        updatedFileContent = fileContent.replace(fullPath, resolvedPath);
        yield* (0, index_js_1.writeFileEffect)(writePath, updatedFileContent);
    }
    if (!importMatch && !dynamicImportMatch) {
        return undefined;
    }
    return writePath;
}), effect_1.Effect.withSpan('transform-import-statements', {
    attributes: {
        distPath,
        rootDir,
        sourceFilePath,
        entryPoint,
        pathsAliases,
        fileContent,
    },
}));
exports.transformImportStatements = transformImportStatements;
//# sourceMappingURL=transform-import-statements.js.map