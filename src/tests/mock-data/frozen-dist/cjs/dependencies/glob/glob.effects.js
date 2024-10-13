"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globEffect = void 0;
const effect_1 = require("effect");
const glob_1 = require("glob");
const glob_error_js_1 = require("./glob.error.js");
const globEffect = (path, pattern) => effect_1.Effect.tryPromise({
    try: () => (0, glob_1.glob)(pattern, {
        cwd: path,
    }),
    catch: (e) => new glob_error_js_1.GlobError({ cause: e }),
});
exports.globEffect = globEffect;
//# sourceMappingURL=glob.effects.js.map