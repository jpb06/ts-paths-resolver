"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicImportPathRegex = exports.importPathRegex = exports.esmWildcardImportRegex = exports.esmDynamicImportRegex = exports.esmImportRegex = exports.requirePathRegex = exports.commonjsRequireWildcardPathRegex = exports.commonjsRequireRegex = exports.rootDirRegex = exports.captureAroundTsRegex = exports.sourceFileRegex = exports.regexEscape = void 0;
const regexEscape = (str) => str.replace(/[//.*+?^${}()|[\]\\]/g, '\\$&');
exports.regexEscape = regexEscape;
exports.sourceFileRegex = /\.(t|j)sx?$/;
exports.captureAroundTsRegex = /(\.)t(sx?)$/;
const rootDirRegex = (rootDir) => new RegExp(`^${(0, exports.regexEscape)(rootDir)}(.*)$`);
exports.rootDirRegex = rootDirRegex;
//cjs
const commonjsRequireRegex = (alias) => new RegExp((0, exports.regexEscape)(`require("${alias}")`));
exports.commonjsRequireRegex = commonjsRequireRegex;
const commonjsRequireWildcardPathRegex = (alias) => new RegExp(`(require\\(")${(0, exports.regexEscape)(alias)}(.*"\\))`);
exports.commonjsRequireWildcardPathRegex = commonjsRequireWildcardPathRegex;
const requirePathRegex = (alias) => `require\\("${(0, exports.regexEscape)(alias)}(.*)"\\)`;
exports.requirePathRegex = requirePathRegex;
// esm
const esmImportRegex = (alias) => new RegExp((0, exports.regexEscape)(`from '${alias}'`));
exports.esmImportRegex = esmImportRegex;
const esmDynamicImportRegex = (alias) => new RegExp((0, exports.regexEscape)(`import\(["']${alias}["']\)`));
exports.esmDynamicImportRegex = esmDynamicImportRegex;
const esmWildcardImportRegex = (alias) => new RegExp(`(from ')${(0, exports.regexEscape)(alias)}(.*')`);
exports.esmWildcardImportRegex = esmWildcardImportRegex;
const importPathRegex = (alias) => `import.*from '(${(0, exports.regexEscape)(alias)}(.*))'`;
exports.importPathRegex = importPathRegex;
const dynamicImportPathRegex = (alias) => new RegExp(`import\\(["'](${(0, exports.regexEscape)(alias)}(.*))["']\\)`);
exports.dynamicImportPathRegex = dynamicImportPathRegex;
//# sourceMappingURL=regex.js.map