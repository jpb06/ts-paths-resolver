export const transpiledEsmWithMultipleDynamicImportsMockData = `export const yolo = async () => {
  const fs = await import('@dependencies/fs/index.js');
  const http = await import('@dependencies/http/index.js');
  const yolo = await import('@dependencies/yolo/bro/index.js');
}`;
