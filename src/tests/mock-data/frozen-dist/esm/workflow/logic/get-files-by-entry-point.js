import { Effect } from 'effect';
import { globEffect } from '@dependencies/glob/index.js';
export const getFilesByEntryPoint = (distPath, entryPoints) => {
    const filesByEntryPoint = Object.values(entryPoints)
        .filter(Boolean)
        .map((entryPoint) => {
        const path = entryPoint.split('/').slice(0, -1).join('/');
        return {
            globEffect: globEffect(distPath, [
                `${path}/**/*.js`,
                `${path}/**/*.d.ts`,
            ]),
            entryPoint: entryPoint,
        };
    });
    return Effect.forEach(filesByEntryPoint, ({ entryPoint, globEffect }) => Effect.gen(function* () {
        const files = yield* globEffect;
        return {
            entryPoint,
            files,
        };
    }), {
        concurrency: 'unbounded',
    });
};
//# sourceMappingURL=get-files-by-entry-point.js.map