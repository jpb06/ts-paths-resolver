import { runPromise } from 'effect-errors';

import { resolveTsPaths } from '../workflow/resolve-ts-paths.workflow.js';

await runPromise(
  resolveTsPaths({
    distPath: './dist',
    packageJsonPath: './package.json',
    tsconfigPath: './tsconfig.json',
  }),
);
