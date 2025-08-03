import type { FileTransformResolution } from './transform-imports/types.js';

export const regroupByFile = (alteredFiles: FileTransformResolution[]) =>
  alteredFiles
    .reduce<FileTransformResolution[]>((result, file) => {
      if (file.resolutions.length === 0) {
        return result;
      }

      const maybeFile = result.find(
        ({ filePath }) => filePath === file.filePath,
      );
      if (maybeFile) {
        maybeFile.resolutions.push(...file.resolutions);

        return result;
      }

      return [...result, file];
    }, [])
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
