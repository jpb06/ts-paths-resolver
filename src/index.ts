import { Effect } from 'effect';
import {
  type ResolveTsPathsArgs,
  resolveTsPathsEffect,
} from './workflow/resolve-ts-paths.workflow.js';

const resolveTsPaths = async (args: ResolveTsPathsArgs) =>
  Effect.runPromise(resolveTsPathsEffect(args));

export { resolveTsPaths, resolveTsPathsEffect, type ResolveTsPathsArgs };
