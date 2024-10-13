"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortestPathChunks = void 0;
const get_last_item_js_1 = require("./get-last-item.js");
const is_source_file_js_1 = require("./is-source-file.js");
const keep_distinct_js_1 = require("./keep-distinct.js");
const getShortestPathChunks = (a, b) => {
    const aChunks = a.split('/');
    const bChunks = b.split('/');
    const aDiverging = (0, keep_distinct_js_1.keepDistinct)(aChunks, bChunks);
    const lastADiverging = (0, get_last_item_js_1.getLastItem)(aDiverging);
    const back = (0, is_source_file_js_1.isSourceFile)(lastADiverging)
        ? aDiverging.slice(0, -1).map(() => '..')
        : aDiverging.map(() => '..');
    const bDiverging = (0, keep_distinct_js_1.keepDistinct)(bChunks, aChunks);
    const lastBDiverging = (0, get_last_item_js_1.getLastItem)(bDiverging);
    const isLastBDivergingAFile = (0, is_source_file_js_1.isSourceFile)(lastBDiverging);
    const forward = isLastBDivergingAFile ? bDiverging.slice(0, -1) : bDiverging;
    const file = isLastBDivergingAFile ? bDiverging.slice(-1) : 'index.js';
    return {
        back,
        forward,
        file,
    };
};
exports.getShortestPathChunks = getShortestPathChunks;
//# sourceMappingURL=get-shortest-path-chunks.js.map