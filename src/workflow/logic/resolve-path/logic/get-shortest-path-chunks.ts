import { getLastItem } from './get-last-item.js';
import { isSourceFile } from './is-source-file.js';
import { keepDistinct } from './keep-distinct.js';

export const getShortestPathChunks = (a: string, b: string) => {
  const aChunks = a.split('/');
  const bChunks = b.split('/');

  const aDiverging = keepDistinct(aChunks, bChunks);
  const lastADiverging = getLastItem(aDiverging);

  const back = isSourceFile(lastADiverging)
    ? aDiverging.slice(0, -1).map(() => '..')
    : aDiverging.map(() => '..');

  const bDiverging = keepDistinct(bChunks, aChunks);
  const lastBDiverging = getLastItem(bDiverging);
  const isLastBDivergingAFile = isSourceFile(lastBDiverging);

  const forward = isLastBDivergingAFile ? bDiverging.slice(0, -1) : bDiverging;
  const file = isLastBDivergingAFile ? bDiverging.slice(-1) : 'index.js';

  return {
    back,
    forward,
    file,
  };
};
