import { Effect } from 'effect';
import { glob } from 'glob';
import { GlobError } from './glob.error.js';
export const globEffect = (path, pattern) => Effect.tryPromise({
    try: () => glob(pattern, {
        cwd: path,
    }),
    catch: (e) => new GlobError({ cause: e }),
});
//# sourceMappingURL=glob.effects.js.map