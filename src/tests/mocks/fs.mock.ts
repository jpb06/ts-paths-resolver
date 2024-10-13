import type * as Fs from 'node:fs/promises';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

export const mockFs = () => {
  const fsMock = mockDeep<typeof Fs>();
  vi.doMock('node:fs/promises', () => fsMock);

  return fsMock;
};
