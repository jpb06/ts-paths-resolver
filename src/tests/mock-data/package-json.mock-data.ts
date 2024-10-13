export const packageJsonMockData = `{
  "main": "./cjs/index.js",
  "module": "./esm/index.js",
  "types": "./dts/index.d.ts",
  "exports": {
    ".": {
      "require": {
        "default": "./cjs/index.js"
      },
      "import": {
        "default": "./esm/index.js"
      }
    }
  }
}
`;
