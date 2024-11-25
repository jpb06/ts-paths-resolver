import { NodeFileSystem } from '@effect/platform-node';
import { Effect, pipe } from 'effect';

import {
  type ResolveTsPathsArgs,
  resolveTsPathsEffect,
} from './workflow/resolve-ts-paths.workflow.js';

const resolveTsPaths = async (args: ResolveTsPathsArgs) =>
  Effect.runPromise(
    pipe(resolveTsPathsEffect(args), Effect.provide(NodeFileSystem.layer)),
  );

export { resolveTsPaths, resolveTsPathsEffect, type ResolveTsPathsArgs };
