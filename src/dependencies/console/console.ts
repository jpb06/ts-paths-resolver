import colors from 'picocolors';

const packageName = 'ts-paths-resolver';

export const displaySuccess = (resolvedCount: number) => {
  const noChanges = colors.yellowBright('No paths aliases found 🤷');
  const summary = `${colors.yellowBright(resolvedCount)} files updated`;

  if (resolvedCount === 0) {
    console.info(`${colors.cyanBright(packageName)} 🚀 - ${noChanges}`);
  } else {
    console.info(
      `${colors.cyanBright(packageName)} 🚀 - ${colors.greenBright(
        'Paths aliases successfully replaced by relative paths',
      )} (${summary})`,
    );
  }
};

export const displayError = (err: unknown) => {
  console.error(
    `${colors.cyanBright(packageName)} ❌ - ${colors.redBright(
      (err as { stack: string }).stack,
    )}`,
  );
};
