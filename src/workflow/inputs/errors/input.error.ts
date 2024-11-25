import { TaggedError } from 'effect/Data';

export class InputError extends TaggedError('input-error')<{
  cause?: unknown;
  message?: string;
}> {}
