import { sourceFileRegex } from '@regex';

export const isSourceFile = (name?: string) =>
  name && sourceFileRegex.test(name);
