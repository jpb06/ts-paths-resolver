"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArguments = void 0;
const picocolors_1 = __importDefault(require("picocolors"));
const helpers_1 = require("yargs/helpers");
const yargs_1 = __importDefault(require("yargs/yargs"));
const validateArguments = () => {
    const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .scriptName('resolveTsPaths')
        .usage(picocolors_1.default.blueBright('$0 -d [distPath] -tsc [tsconfigPath] -pj [packageJsonPath]'))
        .epilogue('resolves typescript paths aliases')
        .example('$0 -d ./dist -tsc ./tsconfig.json -pj ./package.json', '')
        .describe('d', picocolors_1.default.cyanBright('The path to the repo'))
        .describe('tsc', picocolors_1.default.cyanBright('The height'))
        .describe('pj', picocolors_1.default.cyanBright('The height'))
        .default('d', './dist')
        .default('tsc', './tsconfig.json')
        .default('pj', './package.json').argv;
    return {
        distPath: argv.d,
        tsconfigPath: argv.tsc,
        packageJsonPath: argv.pj,
    };
};
exports.validateArguments = validateArguments;
//# sourceMappingURL=validate-args.js.map