import colors from 'picocolors';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import type { ResolveTsPathsArgs } from '../../workflow/resolve-ts-paths.workflow.js';

interface Args {
  path: string;
  tsconfigPath: string;
  debug: string;
}

export const validateArguments = (): ResolveTsPathsArgs => {
  const argv = yargs(hideBin(process.argv))
    .scriptName('resolve-ts-paths')
    .usage(
      colors.blueBright(
        '$0 --path [distPath] --tsconfigPath [tsconfigPath] --debug [debug]',
      ),
    )
    .epilogue('resolves typescript paths aliases')
    .example('$0 --path ./dist --tsconfigPath ./tsconfig.json --debug true', '')
    .describe('path', colors.cyanBright('sources paths'))
    .describe('tsconfigPath', colors.cyanBright('tsconfig.json path'))
    .describe('debug', colors.cyanBright('display paths transforms'))
    .default('path', './dist')
    .default('tsconfigPath', './tsconfig.json')
    .default('debug', '').argv as Args;

  return {
    path: argv.path,
    tsconfigPath: argv.tsconfigPath,
    debug: argv.debug === 'true',
  };
};
