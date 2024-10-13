"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesByEntryPoint = void 0;
const effect_1 = require("effect");
const index_js_1 = require("@dependencies/glob/index.js");
const getFilesByEntryPoint = (distPath, entryPoints) => {
    const filesByEntryPoint = Object.values(entryPoints)
        .filter(Boolean)
        .map((entryPoint) => {
        const path = entryPoint.split('/').slice(0, -1).join('/');
        return {
            globEffect: (0, index_js_1.globEffect)(distPath, [
                `${path}/**/*.js`,
                `${path}/**/*.d.ts`,
            ]),
            entryPoint: entryPoint,
        };
    });
    return effect_1.Effect.forEach(filesByEntryPoint, ({ entryPoint, globEffect }) => effect_1.Effect.gen(function* () {
        const files = yield* globEffect;
        return {
            entryPoint,
            files,
        };
    }), {
        concurrency: 'unbounded',
    });
};
exports.getFilesByEntryPoint = getFilesByEntryPoint;
//# sourceMappingURL=get-files-by-entry-point.js.map