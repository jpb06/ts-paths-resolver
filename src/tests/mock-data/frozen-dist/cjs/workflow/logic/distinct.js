"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = void 0;
const distinct = (array) => array
    .filter((v) => v !== undefined)
    .reduce((acc, curr) => {
    if (acc.includes(curr)) {
        return acc;
    }
    return [...acc, curr];
}, []);
exports.distinct = distinct;
//# sourceMappingURL=distinct.js.map