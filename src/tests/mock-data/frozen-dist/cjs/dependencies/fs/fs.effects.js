"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileEffect = exports.existsEffect = exports.readJsonEffect = exports.readFileEffect = exports.readFileAsStringEffect = void 0;
const promises_1 = require("node:fs/promises");
const comment_json_1 = require("comment-json");
const effect_1 = require("effect");
const fs_error_js_1 = require("./fs.error.js");
const readFileAsStringEffect = (path) => (0, effect_1.pipe)(effect_1.Effect.tryPromise({
    try: () => (0, promises_1.readFile)(path, { encoding: 'utf8' }),
    catch: (e) => new fs_error_js_1.FsError({ cause: e }),
}), effect_1.Effect.withSpan('read-file-as-string', { attributes: { path } }));
exports.readFileAsStringEffect = readFileAsStringEffect;
const readFileEffect = (path) => (0, effect_1.pipe)(effect_1.Effect.tryPromise({
    try: () => (0, promises_1.readFile)(path),
    catch: (e) => new fs_error_js_1.FsError({ cause: e }),
}), effect_1.Effect.withSpan('read-file', { attributes: { path } }));
exports.readFileEffect = readFileEffect;
const readJsonEffect = (path) => (0, effect_1.pipe)(effect_1.Effect.tryPromise({
    try: () => (0, promises_1.readFile)(path, { encoding: 'utf8' }),
    catch: (e) => new fs_error_js_1.FsError({ cause: e }),
}), effect_1.Effect.map((data) => (0, comment_json_1.parse)(data)), effect_1.Effect.withSpan('read-json', { attributes: { path } }));
exports.readJsonEffect = readJsonEffect;
const hasCode = (error) => {
    return error?.code !== undefined;
};
const existsEffect = (path) => (0, effect_1.pipe)(effect_1.Effect.tryPromise({
    try: () => (0, promises_1.stat)(path),
    catch: (err) => {
        if (hasCode(err) && err.code === 'ENOENT') {
            return { _tag: 'enoent' };
        }
        return new fs_error_js_1.FsError({ cause: err });
    },
}), effect_1.Effect.catchTag('enoent', () => effect_1.Effect.succeed(false)), effect_1.Effect.map(Boolean), effect_1.Effect.withSpan('file-exists', { attributes: { path } }));
exports.existsEffect = existsEffect;
const writeFileEffect = (path, data) => (0, effect_1.pipe)(effect_1.Effect.tryPromise({
    try: () => (0, promises_1.writeFile)(path, data),
    catch: (e) => new fs_error_js_1.FsError({ cause: e }),
}), effect_1.Effect.withSpan('write-file', { attributes: { path } }));
exports.writeFileEffect = writeFileEffect;
//# sourceMappingURL=fs.effects.js.map