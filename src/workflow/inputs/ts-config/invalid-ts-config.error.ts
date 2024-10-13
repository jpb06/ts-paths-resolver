import { TaggedError } from 'effect/Data';

export class InvalidTsConfigFileError extends TaggedError(
  'invalid-tsconfig-file-error',
)<{
  cause?: unknown;
  message?: string;
}> {}
