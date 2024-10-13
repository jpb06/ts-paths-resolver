"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepDistinct = void 0;
const keepDistinct = (self, target) => self.reduce((acc, curr, index) => {
    if (target.length > index && target[index] !== curr) {
        return [...acc, curr];
    }
    if (target.length <= index) {
        return [...acc, curr];
    }
    return acc;
}, []);
exports.keepDistinct = keepDistinct;
//# sourceMappingURL=keep-distinct.js.map