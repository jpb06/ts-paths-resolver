import { describe, expect, it } from 'vitest';
import { resolveFullPath } from './resolve-full-path.js';

describe('resolveFullPath function', () => {
  describe('with src root dir', () => {
    it('should resolve parent folder child folder', () => {
      const rootDir = './src';
      const entryPoint = './cjs/index.js';
      const current = './cjs/layer/file-storage.layer.js';
      const target = './src/effects/index.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./../effects/index.js');
    });

    it('should resolve parent folder deep nested child folders', () => {
      const rootDir = './src';
      const entryPoint = './cjs/index.js';
      const current = './cjs/layer/file-storage.layer.js';
      const target = './src/effects/util/cool/index.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./../effects/util/cool/index.js');
    });

    it('should resolve siblings', () => {
      const rootDir = './src';
      const entryPoint = './cjs/index.js';
      const current = './cjs/layer/file-storage.layer.js';
      const target = './src/layer/cool.tsx';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./cool.jsx');
    });

    it('should resolve child', () => {
      const rootDir = './src';
      const entryPoint = './cjs/index.js';
      const current = './cjs/layer/file-storage.layer.js';
      const target = './src/layer/some-sub-path/cool.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./some-sub-path/cool.js');
    });

    it('should resolve deep nested child', () => {
      const rootDir = './src';
      const entryPoint = './cjs/index.js';
      const current = './cjs/layer/file-storage.layer.js';
      const target = './src/layer/cool/story/bro/cool.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./cool/story/bro/cool.js');
    });
  });

  describe('with . root dir', () => {
    it('should resolve parent folder child folder', () => {
      const rootDir = '.';
      const entryPoint = './cjs/index.js';
      const current = './cjs/src/layer/file-storage.layer.js';
      const target = './src/effects/index.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./../effects/index.js');
    });

    it('should resolve parent folder deep nested child folders', () => {
      const rootDir = '.';
      const entryPoint = './cjs/index.js';
      const current = './cjs/src/layer/file-storage.layer.js';
      const target = './src/effects/util/cool/index.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./../effects/util/cool/index.js');
    });

    it('should resolve siblings', () => {
      const rootDir = '.';
      const entryPoint = './cjs/index.js';
      const current = './cjs/src/layer/file-storage.layer.js';
      const target = './src/layer/cool.tsx';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./cool.jsx');
    });

    it('should resolve child', () => {
      const rootDir = '.';
      const entryPoint = './cjs/index.js';
      const current = './cjs/src/layer/file-storage.layer.js';
      const target = './src/layer/some-sub-path/cool.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./some-sub-path/cool.js');
    });

    it('should resolve deep nested child', () => {
      const rootDir = '.';
      const entryPoint = './cjs/index.js';
      const current = './cjs/src/layer/file-storage.layer.js';
      const target = './src/layer/cool/story/bro/cool.ts';

      const result = resolveFullPath(rootDir, entryPoint, current, target);

      expect(result).toBe('./cool/story/bro/cool.js');
    });
  });

  it('should enforce path to end with index.js if no file is provided', () => {
    const rootDir = './src';
    const entryPoint = './dist/cjs/index.js';
    const current = './dist/cjs/errors/index.js';
    const target = './src/effects/index.ts';

    const result = resolveFullPath(rootDir, entryPoint, current, target);

    expect(result).toBe('./../effects/index.js');
  });

  it('should only have one slash', () => {
    const rootDir = './src';
    const entryPoint = './dist/cjs/index.js';
    const current = './dist/cjs/effects/index.js';
    const target = './src/effects/index.ts';

    const result = resolveFullPath(rootDir, entryPoint, current, target);

    expect(result).toBe('./index.js');
  });

  it('should resolve index origins', () => {
    const rootDir = './src';
    const entryPoint = './dist/cjs/index.js';
    const current = './dist/cjs/errors/index.js';
    const target = './src/effects/index.ts';

    const result = resolveFullPath(rootDir, entryPoint, current, target);

    expect(result).toBe('./../effects/index.js');
  });
});
