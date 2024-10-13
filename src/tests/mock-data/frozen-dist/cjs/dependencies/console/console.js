"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayError = exports.displaySuccess = void 0;
const picocolors_1 = __importDefault(require("picocolors"));
const packageName = 'ts-paths-resolver';
const displaySuccess = (resolvedCount) => {
    const noChanges = picocolors_1.default.yellowBright('No paths aliases found 🤷');
    const summary = `${picocolors_1.default.yellowBright(resolvedCount)} files updated`;
    if (resolvedCount === 0) {
        console.info(`${picocolors_1.default.cyanBright(packageName)} 🚀 - ${noChanges}`);
    }
    else {
        console.info(`${picocolors_1.default.cyanBright(packageName)} 🚀 - ${picocolors_1.default.greenBright('Paths aliases successfully replaced by relative paths')} (${summary})`);
    }
};
exports.displaySuccess = displaySuccess;
const displayError = (err) => {
    console.error(`${picocolors_1.default.cyanBright(packageName)} ❌ - ${picocolors_1.default.redBright(err.stack)}`);
};
exports.displayError = displayError;
//# sourceMappingURL=console.js.map