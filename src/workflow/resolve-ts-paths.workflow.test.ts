import { exec } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import util from 'node:util';

import { NodeFileSystem } from '@effect/platform-node';
import { parse } from 'comment-json';
import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { glob } from 'glob';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const execPromise = util.promisify(exec);

import { displaySuccess } from '@dependencies/console/index.js';

vi.mock('@dependencies/console/console.js');

describe('resolveTsPaths function', () => {
  const distPath = './src/tests/mock-data/dist';
  const packageJsonPath = './package.json';
  const tsconfigPath = './tsconfig.json';
  const tsPaths: string[] = [];

  beforeAll(async () => {
    vi.mocked(displaySuccess).mockImplementation(() => Effect.void);

    const tsconfigData = await readFile('./tsconfig.json', {
      encoding: 'utf-8',
    });
    // biome-ignore lint/suspicious/noExplicitAny: test
    const tsconfig = parse(tsconfigData) as any;
    tsPaths.push(
      ...Object.keys(tsconfig.compilerOptions.paths).map((alias) =>
        alias.endsWith('/*') ? alias.slice(0, -1) : alias,
      ),
    );
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await execPromise('rm -rf ./src/tests/mock-data/dist');
  });

  afterAll(() => {
    execPromise('rm -rf ./src/tests/mock-data/dist');
  });

  it('should report no changes', async () => {
    const { resolveTsPathsEffect } = await import(
      './resolve-ts-paths.workflow.js'
    );

    await runPromise(
      pipe(
        resolveTsPathsEffect({ distPath, packageJsonPath, tsconfigPath }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(displaySuccess).toHaveBeenCalledWith(0);
  });

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: test
  it('should translate import and require statements', async () => {
    await execPromise(
      'cp -R ./src/tests/mock-data/frozen-dist ./src/tests/mock-data/dist',
    );

    const { resolveTsPathsEffect } = await import(
      './resolve-ts-paths.workflow.js'
    );

    await runPromise(
      pipe(
        resolveTsPathsEffect({ distPath, packageJsonPath, tsconfigPath }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(displaySuccess).toHaveBeenCalledWith(27);

    const cjsFiles = await glob('**/*.js', {
      cwd: './src/tests/mock-data/dist/cjs',
    });
    expect(cjsFiles).toHaveLength(34);
    const foundCjsRequires: string[] = [];
    for (const file of cjsFiles) {
      const path = `./src/tests/mock-data/dist/cjs/${file}`;

      const data = await readFile(path, { encoding: 'utf-8' });
      for (const alias of tsPaths) {
        if (data.includes(`require("${alias}`)) {
          foundCjsRequires.push(`${path} - ${alias}`);
        }
      }
    }
    expect(foundCjsRequires).toHaveLength(0);

    const esmFiles = await glob('**/*.js', {
      cwd: './src/tests/mock-data/dist/esm',
    });
    expect(esmFiles).toHaveLength(34);
    const foundEsmImports: string[] = [];
    for (const file of esmFiles) {
      const path = `./src/tests/mock-data/dist/esm/${file}`;

      const data = await readFile(path, { encoding: 'utf-8' });
      for (const alias of tsPaths) {
        if (data.includes(`from '${alias}`)) {
          foundEsmImports.push(`${path} - ${alias}`);
        }
      }
    }
    expect(foundEsmImports).toHaveLength(0);

    const dtsFiles = await glob('**/*.d.ts', {
      cwd: './src/tests/mock-data/dist/dts',
    });
    expect(dtsFiles).toHaveLength(34);
    const foundDtsImports: string[] = [];
    for (const file of dtsFiles) {
      const path = `./src/tests/mock-data/dist/dts/${file}`;

      const data = await readFile(path, { encoding: 'utf-8' });
      for (const alias of tsPaths) {
        if (data.includes(`import("${alias}`)) {
          foundDtsImports.push(`${path} - ${alias}`);
        }
      }
    }
    expect(foundDtsImports).toHaveLength(0);
  });
});
