import { Effect } from 'effect';

import { globEffect } from '@dependencies/glob/index.js';

import type { EffectResultSuccess } from '../../types/effect.types.js';
import type { EntryPoints } from '../inputs/index.js';

export type FilesByEntryPoint = EffectResultSuccess<
  typeof getFilesByEntryPoint
>;

export const getFilesByEntryPoint = (
  distPath: string,
  entryPoints: EntryPoints,
) => {
  const filesByEntryPoint = Object.values(entryPoints)
    .filter(Boolean)
    .map((entryPoint) => {
      const path = entryPoint!.split('/').slice(0, -1).join('/');

      return {
        globEffect: globEffect(distPath, [
          `${path}/**/*.js`,
          `${path}/**/*.d.ts`,
        ]),
        entryPoint: entryPoint!,
      };
    });

  return Effect.forEach(
    filesByEntryPoint,
    ({ entryPoint, globEffect }) =>
      Effect.gen(function* () {
        const files = yield* globEffect;

        return {
          entryPoint,
          files,
        };
      }),
    {
      concurrency: 'unbounded',
    },
  );
};
