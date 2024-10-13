import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GlobError } from '@dependencies/glob/glob.error.js';
import { mockGlob } from '@tests/mocks';

describe('getFilesByEntryPoint function', () => {
  const distPath = './dist';
  const entryPoints = {
    cjsEntryPoint: './cjs/index.js',
    dtsEntryPoint: './dts/index.d.ts',
    esmEntryPoint: './esm/index.js',
  };

  const { glob } = mockGlob();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should raise a GlobError if glog fails', async () => {
    const cause = 'Oh no!';
    glob.mockRejectedValue(cause);

    const { getFilesByEntryPoint } = await import(
      './get-files-by-entry-point.js'
    );

    const result = await Effect.runPromise(
      pipe(getFilesByEntryPoint(distPath, entryPoints), Effect.flip),
    );

    expect(result).toBeInstanceOf(GlobError);
    expect(result.cause).toBe(cause);
  });

  it('should raise a GlobError if glog fails', async () => {
    glob
      .mockResolvedValueOnce(['cjs'])
      .mockResolvedValueOnce(['dts'])
      .mockResolvedValueOnce(['esm']);

    const { getFilesByEntryPoint } = await import(
      './get-files-by-entry-point.js'
    );

    const result = await runPromise(
      getFilesByEntryPoint(distPath, entryPoints),
    );

    expect(glob).toHaveBeenCalledTimes(3);
    expect(glob.mock.calls[0]).toStrictEqual([
      ['./cjs/**/*.js', './cjs/**/*.d.ts'],
      { cwd: distPath },
    ]);
    expect(glob.mock.calls[1]).toStrictEqual([
      ['./dts/**/*.js', './dts/**/*.d.ts'],
      { cwd: distPath },
    ]);
    expect(glob.mock.calls[2]).toStrictEqual([
      ['./esm/**/*.js', './esm/**/*.d.ts'],
      { cwd: distPath },
    ]);

    expect(result).toMatchSnapshot();
  });
});
