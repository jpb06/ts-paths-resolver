"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSourceFile = void 0;
const _regex_1 = require("@regex");
const isSourceFile = (name) => name && _regex_1.sourceFileRegex.test(name);
exports.isSourceFile = isSourceFile;
//# sourceMappingURL=is-source-file.js.map