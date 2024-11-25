#!/usr/bin/env node

import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';

import { resolveTsPathsEffect } from '../workflow/resolve-ts-paths.workflow.js';
import { validateArguments } from './args/validate-args.js';

(async () => {
  const args = validateArguments();
  await runPromise(
    pipe(resolveTsPathsEffect(args), Effect.provide(NodeFileSystem.layer)),
  );
})();
