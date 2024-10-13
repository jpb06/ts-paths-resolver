"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFullPath = void 0;
const _regex_1 = require("@regex");
const get_shortest_path_chunks_js_1 = require("./logic/get-shortest-path-chunks.js");
const resolveFullPath = (rootDir, entryPoint, current, target) => {
    const targetWithoutRootDir = target
        .replace((0, _regex_1.rootDirRegex)(rootDir), `${entryPoint.split('/').slice(0, -1).join('/')}$1`)
        .replace(_regex_1.captureAroundTsRegex, '$1j$2');
    const relativeCurrent = current.startsWith('./') ? current : `./${current}`;
    const chunks = (0, get_shortest_path_chunks_js_1.getShortestPathChunks)(relativeCurrent, targetWithoutRootDir);
    return ['.', ...chunks.back, ...chunks.forward, chunks.file].join('/');
};
exports.resolveFullPath = resolveFullPath;
//# sourceMappingURL=resolve-full-path.js.map