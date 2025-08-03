import { Console, Effect } from 'effect';
import colors from 'picocolors';

import type { FileTransformResolution } from '../../workflow/logic/transform-imports/types.js';

const packageName = 'ts-paths-resolver';

export const displaySuccess = (
  modifiedFilesCount: number,
  pathsResolvedCount: number,
) =>
  Effect.gen(function* () {
    const noChanges = colors.yellowBright('No paths aliases found 🤷');
    const summary = `${colors.yellowBright(modifiedFilesCount)} files updated - ${colors.yellowBright(pathsResolvedCount)} paths resolved`;

    if (modifiedFilesCount === 0) {
      return yield* Console.info(
        `${colors.cyanBright(packageName)} 🚀 - ${noChanges}`,
      );
    }

    yield* Console.info(
      `${colors.cyanBright(packageName)} 🚀 - ${colors.greenBright(
        'Paths aliases successfully replaced by relative paths',
      )} (${summary})`,
    );
  });

export const displayAlterations = (
  alterationsByFile: FileTransformResolution[],
) =>
  Effect.gen(function* () {
    if (alterationsByFile.length === 0) {
      return;
    }

    yield* Console.info('');

    for (const { filePath, resolutions } of alterationsByFile) {
      yield* Console.info(`${colors.cyan('◯')} ${colors.cyanBright(filePath)}`);

      for (const { alias, resolvedPath } of resolutions) {
        yield* Console.info(
          `${colors.cyan('│')} ${colors.white(alias)} ${colors.gray('->')} ${colors.white(resolvedPath)}`,
        );
      }
      yield* Console.info(colors.cyan('┴'));
    }
  });
