export const regexEscape = (str) => str.replace(/[//.*+?^${}()|[\]\\]/g, '\\$&');
export const sourceFileRegex = /\.(t|j)sx?$/;
export const captureAroundTsRegex = /(\.)t(sx?)$/;
export const rootDirRegex = (rootDir) => new RegExp(`^${regexEscape(rootDir)}(.*)$`);
//cjs
export const commonjsRequireRegex = (alias) => new RegExp(regexEscape(`require("${alias}")`));
export const commonjsRequireWildcardPathRegex = (alias) => new RegExp(`(require\\(")${regexEscape(alias)}(.*"\\))`);
export const requirePathRegex = (alias) => `require\\("${regexEscape(alias)}(.*)"\\)`;
// esm
export const esmImportRegex = (alias) => new RegExp(regexEscape(`from '${alias}'`));
export const esmDynamicImportRegex = (alias) => new RegExp(regexEscape(`import\(["']${alias}["']\)`));
export const esmWildcardImportRegex = (alias) => new RegExp(`(from ')${regexEscape(alias)}(.*')`);
export const importPathRegex = (alias) => `import.*from '(${regexEscape(alias)}(.*))'`;
export const dynamicImportPathRegex = (alias) => new RegExp(`import\\(["'](${regexEscape(alias)}(.*))["']\\)`);
//# sourceMappingURL=regex.js.map