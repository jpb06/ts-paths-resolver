import { Match } from 'effect';
export const getEntryPointFor = (target, data) => Match.value(target).pipe(Match.when('cjs', () => data.main ?? data.exports?.['.'].require.default), Match.when('esm', () => data.module ?? data.exports?.['.'].import.default), Match.when('types', () => data.types), Match.exhaustive);
//# sourceMappingURL=get-entry-point.js.map