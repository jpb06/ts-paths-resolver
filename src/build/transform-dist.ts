import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';

import { resolveTsPathsEffect } from '../workflow/resolve-ts-paths.workflow.js';

await runPromise(
  pipe(
    resolveTsPathsEffect({
      distPath: './dist',
      packageJsonPath: './package.json',
      tsconfigPath: './tsconfig.json',
    }),
    Effect.provide(NodeFileSystem.layer),
  ),
);
