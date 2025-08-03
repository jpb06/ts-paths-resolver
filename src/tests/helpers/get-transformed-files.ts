import { readFile } from 'node:fs/promises';

import { glob } from 'glob';

export const getTransformedFiles = async (
  path: string,
  target: 'cjs' | 'esm' | 'dts',
  tsPaths: string[],
  statementMatcher: (data: string, alias: string) => boolean,
) => {
  const jsFiles = await glob(target === 'dts' ? '**/*.d.ts' : '**/*.js', {
    cwd: `${path}/${target}`,
  });

  const foundStatements: string[] = [];
  for (const file of jsFiles) {
    const filepath = `${path}/${target}/${file}`;
    const data = await readFile(filepath, { encoding: 'utf-8' });

    for (const alias of tsPaths) {
      const found = statementMatcher(data, alias);
      if (found) {
        foundStatements.push(`${filepath} - ${alias}`);
      }
    }
  }

  return {
    jsFiles,
    foundStatements,
  };
};
