import { Match } from 'effect';

import type { MaybePackageJsonWithPaths } from './package-json.types.js';

export const getEntryPointFor = (
  target: 'cjs' | 'esm' | 'types',
  data: MaybePackageJsonWithPaths,
) =>
  Match.value(target).pipe(
    Match.when('cjs', () => data.main ?? data.exports?.['.'].require.default),
    Match.when('esm', () => data.module ?? data.exports?.['.'].import.default),
    Match.when('types', () => data.types),
    Match.exhaustive,
  );
