export const regexEscape = (str: string) =>
  str.replace(/[//.*+?^${}()|[\]\\]/g, '\\$&');

export const sourceFileRegex = /\.(t|j)sx?$/;
export const captureAroundTsRegex = /(\.)t(sx?)$/;

export const rootDirRegex = (rootDir: string) =>
  new RegExp(`^${regexEscape(rootDir)}(.*)$`);

//cjs
export const commonjsRequireRegex = (alias: string) =>
  new RegExp(regexEscape(`require("${alias}")`));

export const commonjsRequireWildcardPathRegex = (alias: string) =>
  new RegExp(`(require\\(")${regexEscape(alias)}(.*"\\))`);

export const requirePathRegex = (alias: string) =>
  `require\\("${regexEscape(alias)}(.*)"\\)`;

// esm
export const esmImportRegex = (alias: string) =>
  new RegExp(regexEscape(`from '${alias}'`));

export const esmDynamicImportRegex = (alias: string) =>
  new RegExp(`import\\(["']${regexEscape(alias)}["']\\)`, 'g');

export const esmWildcardImportRegex = (alias: string) =>
  new RegExp(`(from ')${regexEscape(alias)}(.*')`);

export const importPathRegex = (alias: string) =>
  `import.*from '(${regexEscape(alias)}(.*))'`;

export const dynamicImportPathRegex = (alias: string) =>
  new RegExp(`import\\(["'](${regexEscape(alias)}(\\S*))["']\\)`);
