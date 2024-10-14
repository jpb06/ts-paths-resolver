#!/usr/bin/env node

import { runPromise } from 'effect-errors';
import { resolveTsPathsEffect } from '../workflow/resolve-ts-paths.workflow.js';
import { validateArguments } from './args/validate-args.js';

(async () => {
  const args = validateArguments();
  await runPromise(resolveTsPathsEffect(args));
})();
