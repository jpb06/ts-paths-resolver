"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntryPointFor = void 0;
const effect_1 = require("effect");
const getEntryPointFor = (target, data) => effect_1.Match.value(target).pipe(effect_1.Match.when('cjs', () => data.main ?? data.exports?.['.'].require.default), effect_1.Match.when('esm', () => data.module ?? data.exports?.['.'].import.default), effect_1.Match.when('types', () => data.types), effect_1.Match.exhaustive);
exports.getEntryPointFor = getEntryPointFor;
//# sourceMappingURL=get-entry-point.js.map