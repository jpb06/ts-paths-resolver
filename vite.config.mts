import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: vitest
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/tests',
        'src/types',
        'src/temp',
        'src/build',
        'src/cli/**',
        '**/index.ts',
        '**/*.d.ts',
        '**/*.type.ts',
        '**/*.types.ts',
        '**/*.test.ts',
        '**/types.ts',
        '**/*.error.ts',
      ],
    },
  },
});
