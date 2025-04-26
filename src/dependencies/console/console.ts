import { Console, Effect } from 'effect';
import colors from 'picocolors';

const packageName = 'ts-paths-resolver';

export const displaySuccess = (resolvedCount: number) =>
  Effect.gen(function* () {
    const noChanges = colors.yellowBright('No paths aliases found 🤷');
    const summary = `${colors.yellowBright(resolvedCount)} files updated`;

    if (resolvedCount === 0) {
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

export const displayError = (err: unknown) =>
  Console.error(
    `${colors.cyanBright(packageName)} ❌ - ${colors.redBright(
      (err as { stack: string }).stack,
    )}`,
  );
