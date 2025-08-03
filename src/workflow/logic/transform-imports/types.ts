export type PathsAliasesEntries = [string, string[]];

export type TransformPathAliasesInFileArgs = {
  distPath: string;
  rootDir: string;
  sourceFilePath: string;
  entryPoint: string;
};

export type PathResolution = {
  alias: string;
  resolvedPath: string;
};

export type FileTransformResolution = {
  filePath: string;
  resolutions: PathResolution[];
};
