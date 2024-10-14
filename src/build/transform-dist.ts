import { runPromise } from 'effect-errors';

import { resolveTsPathsEffect } from '../workflow/resolve-ts-paths.workflow.js';

await runPromise(
  resolveTsPathsEffect({
    distPath: './dist',
    packageJsonPath: './package.json',
    tsconfigPath: './tsconfig.json',
  }),
);
