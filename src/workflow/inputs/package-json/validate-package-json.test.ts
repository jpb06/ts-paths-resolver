import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { describe, expect, it } from 'vitest';

import { FsError } from '@dependencies/fs/fs.error.js';
import { packageJsonMockData } from '@tests/mock-data';
import { mockFs } from '@tests/mocks';

describe('validatePackageJson function', () => {
  const { stat, readFile } = mockFs();

  it('should fail if file does not exist', async () => {
    const path = './package.json';

    stat.mockRejectedValueOnce({
      code: 'ENOENT',
    });

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await Effect.runPromise(
      pipe(validatePackageJson(path), Effect.flip),
    );

    expect(result).toBeInstanceOf(FsError);
    expect(result.cause).toBe(`package.json file not found at ${path}`);
  });

  it('should extract data from package.json', async () => {
    const path = './package.json';

    stat.mockResolvedValueOnce({} as never);
    readFile.mockResolvedValueOnce(packageJsonMockData);

    const { validatePackageJson } = await import('./validate-package-json.js');

    const result = await runPromise(validatePackageJson(path));

    expect(result).toMatchSnapshot();
  });
});
