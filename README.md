# ts-paths-resolver

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://github.dev/jpb06/ts-paths-resolver)
![npm bundle size](https://img.shields.io/bundlephobia/min/ts-paths-resolver)
![Github workflow](https://img.shields.io/github/actions/workflow/status/jpb06/ts-paths-resolver/ci.yml?branch=main&logo=github-actions&label=last%20workflow)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jpb06_ts-paths-resolver)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=security_rating)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=coverage)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jpb06_ts-paths-resolver)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jpb06_ts-paths-resolver)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=code_smells)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jpb06_ts-paths-resolver)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jpb06_ts-paths-resolver)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jpb06_ts-paths-resolver&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=jpb06_ts-paths-resolver)
![Last commit](https://img.shields.io/github/last-commit/jpb06/ts-paths-resolver?logo=git)

Translates typescript paths aliases into relative paths.

<!-- readme-package-icons start -->

<p align="left"><a href="https://docs.github.com/en/actions" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GithubActions-Dark.svg" /></a>&nbsp;<a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp;<a href="https://nodejs.org/en/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NodeJS-Dark.svg" /></a>&nbsp;<a href="https://bun.sh/docs" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Bun-Dark.svg" /></a>&nbsp;<a href="https://biomejs.dev/guides/getting-started/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Biome-Dark.svg" /></a>&nbsp;<a href="https://vitest.dev/guide/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Vitest-Dark.svg" /></a>&nbsp;<a href="https://www.effect.website/docs/quickstart" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Effect-Dark.svg" /></a></p>

<!-- readme-package-icons end -->

## ⚡ Usage

### 🔶 Install

```bash
bun i -D ts-paths-resolver
pnpm i -D ts-paths-resolver
yarn add -D ts-paths-resolver
npm i -D ts-paths-resolver
```

### 🔶 cli

```bash
resolve-ts-paths -d [distPath] -tsc [tsconfigPath] -pj [packageJsonPath]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -d             The path to the repo                        [default: "./dist"]
      --tsc      The height                         [default: "./tsconfig.json"]
      --pj       The height                          [default: "./package.json"]

Examples:
  resolve-ts-paths -d ./dist -tsc ./tsconfig.json -pj ./package.json
```

### 🧿 cjs

```bash
bun resolve-ts-paths -d ./dist -tsc ./tsconfig.json -pj ./package.json
```

### 🧿 esm

```bash
bun resolve-ts-paths-esm -d ./dist -tsc ./tsconfig.json -pj ./package.json
```

### 🔶 node

```ts
import { resolveTsPaths } from 'ts-paths-resolver';

const distPath = './dist';
const tsconfigPath = './tsconfig.json';
const packageJsonPath = './package.json';

await resolveTsPaths({
  distPath,
  tsconfigPath,
  packageJsonPath,
});
```

You can also import the effect:

```ts
import { Effect } from 'effect';
import { resolveTsPathsEffect } from 'ts-paths-resolver';

await Effect.runPromise(
  resolveTsPathsEffect({
    distPath,
    tsconfigPath,
    packageJsonPath,
  })
);
```

## ⚡ Required inputs

This module takes the following input to translate paths aliases import/require statements into relative paths within a folder.

### 🧿 dist folder

The transpiled code location.

### 🧿 `tsconfig.json`

- `rootDir`: Root folder within your source files.
- `paths`: 1 set of entries that re-map imports to additional lookup locations.

```json
{
  "compilerOptions": {
    // ...
    "rootDir": "./src",
    "paths": {
      "@dependencies/*": ["./src/dependencies/*"],
      "@regex": ["./src/util/regex/regex.ts"]
    }
  }
}
```

### 🧿 `package.json`

- `main`: `cjs` entry point.
- `module`: `esm` entry point.
- `types`: declaration files entry point.

```json
{
  "main": "./cjs/index.js",
  "module": "./esm/index.js",
  "types": "./dts/index.d.ts"
  // ...
}
```
