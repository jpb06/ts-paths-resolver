export const distinct = <T>(array: T[]) =>
  array
    .filter((v) => v !== undefined)
    .reduce<T[]>((acc, curr) => {
      if (acc.includes(curr)) {
        return acc;
      }

      return [...acc, curr];
    }, []);
