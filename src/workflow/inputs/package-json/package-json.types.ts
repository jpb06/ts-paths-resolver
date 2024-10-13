export type PackageExportPath = {
  default: string;
  types: string;
};

export type PackageExports = Record<
  string,
  {
    require: PackageExportPath;
    import: PackageExportPath;
  }
>;

export type MaybePackageJsonWithPaths = {
  main?: string;
  module?: string;
  types?: string;
  exports?: PackageExports;
};
