import type * as Glob from 'glob';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockGlob = () => {
  const globMock = mockDeep<typeof Glob>();
  vi.doMock('glob', () => globMock);

  return globMock;
};
