export const getLastItem = <T>(array: T[]) =>
  array.length > 0 ? array.at(array.length - 1) : undefined;
