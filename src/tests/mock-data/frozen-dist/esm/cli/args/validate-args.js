import colors from 'picocolors';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
export const validateArguments = () => {
    const argv = yargs(hideBin(process.argv))
        .scriptName('resolveTsPaths')
        .usage(colors.blueBright('$0 -d [distPath] -tsc [tsconfigPath] -pj [packageJsonPath]'))
        .epilogue('resolves typescript paths aliases')
        .example('$0 -d ./dist -tsc ./tsconfig.json -pj ./package.json', '')
        .describe('d', colors.cyanBright('The path to the repo'))
        .describe('tsc', colors.cyanBright('The height'))
        .describe('pj', colors.cyanBright('The height'))
        .default('d', './dist')
        .default('tsc', './tsconfig.json')
        .default('pj', './package.json').argv;
    return {
        distPath: argv.d,
        tsconfigPath: argv.tsc,
        packageJsonPath: argv.pj,
    };
};
//# sourceMappingURL=validate-args.js.map