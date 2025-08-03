import { cp, readFile, rm } from 'node:fs/promises';

import { NodeFileSystem } from '@effect/platform-node';
import { parse } from 'comment-json';
import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { displaySuccess } from '@dependencies/console/index.js';

import { getTransformedFiles } from '../tests/helpers/index.js';

vi.mock('@dependencies/console/console.js');

describe('resolveTsPaths function', () => {
  const tsconfigPath = './tsconfig.json';
  const path = './src/tests/mock-data/dist';
  const tsPaths: string[] = [];

  beforeAll(async () => {
    await cp('./src/tests/mock-data/frozen-dist', path, {
      recursive: true,
      force: true,
    });
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await rm(path, { recursive: true });
  });

  it('should translate import and require statements', async () => {
    const { resolveTsPathsEffect } = await import(
      './resolve-ts-paths.workflow.js'
    );

    await runPromise(
      pipe(
        resolveTsPathsEffect({ path, tsconfigPath, debug: false }),
        Effect.provide(NodeFileSystem.layer),
      ),
    );

    expect(displaySuccess).toHaveBeenCalledWith(27, 35);

    // commonjs
    const cjs = await getTransformedFiles(path, 'cjs', tsPaths, (data, alias) =>
      data.includes(`require("${alias}`),
    );
    expect(cjs.jsFiles).toHaveLength(34);
    expect(cjs.foundStatements).toHaveLength(0);

    // esmodules
    const esm = await getTransformedFiles(path, 'esm', tsPaths, (data, alias) =>
      data.includes(`from '${alias}`),
    );
    expect(esm.jsFiles).toHaveLength(34);
    expect(esm.foundStatements).toHaveLength(0);

    // declaration files
    const dts = await getTransformedFiles(path, 'dts', tsPaths, (data, alias) =>
      data.includes(`import("${alias}`),
    );
    expect(dts.jsFiles).toHaveLength(34);
    expect(dts.foundStatements).toHaveLength(0);
  });
});
