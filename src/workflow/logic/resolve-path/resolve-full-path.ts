import { captureAroundTsRegex, rootDirRegex } from '@regex';

import { getShortestPathChunks } from './logic/get-shortest-path-chunks.js';

export const resolveFullPath = (
  rootDir: string,
  entryPoint: string,
  current: string,
  target: string,
) => {
  const targetWithoutRootDir = target
    .replace(
      rootDirRegex(rootDir),
      `${entryPoint.split('/').slice(0, -1).join('/')}$1`,
    )
    .replace(captureAroundTsRegex, '$1j$2');

  const relativeCurrent = current.startsWith('./') ? current : `./${current}`;

  const chunks = getShortestPathChunks(relativeCurrent, targetWithoutRootDir);

  return ['.', ...chunks.back, ...chunks.forward, chunks.file].join('/');
};
