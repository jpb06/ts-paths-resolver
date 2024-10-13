import { readFile, stat, writeFile } from 'node:fs/promises';
import { parse } from 'comment-json';
import { Effect, pipe } from 'effect';
import { FsError } from './fs.error.js';
export const readFileAsStringEffect = (path) => pipe(Effect.tryPromise({
    try: () => readFile(path, { encoding: 'utf8' }),
    catch: (e) => new FsError({ cause: e }),
}), Effect.withSpan('read-file-as-string', { attributes: { path } }));
export const readFileEffect = (path) => pipe(Effect.tryPromise({
    try: () => readFile(path),
    catch: (e) => new FsError({ cause: e }),
}), Effect.withSpan('read-file', { attributes: { path } }));
export const readJsonEffect = (path) => pipe(Effect.tryPromise({
    try: () => readFile(path, { encoding: 'utf8' }),
    catch: (e) => new FsError({ cause: e }),
}), Effect.map((data) => parse(data)), Effect.withSpan('read-json', { attributes: { path } }));
const hasCode = (error) => {
    return error?.code !== undefined;
};
export const existsEffect = (path) => pipe(Effect.tryPromise({
    try: () => stat(path),
    catch: (err) => {
        if (hasCode(err) && err.code === 'ENOENT') {
            return { _tag: 'enoent' };
        }
        return new FsError({ cause: err });
    },
}), Effect.catchTag('enoent', () => Effect.succeed(false)), Effect.map(Boolean), Effect.withSpan('file-exists', { attributes: { path } }));
export const writeFileEffect = (path, data) => pipe(Effect.tryPromise({
    try: () => writeFile(path, data),
    catch: (e) => new FsError({ cause: e }),
}), Effect.withSpan('write-file', { attributes: { path } }));
//# sourceMappingURL=fs.effects.js.map