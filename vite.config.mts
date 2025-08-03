import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: vitest
export default defineConfig({
  plugins: [tsconfigPaths()],
  server: { watch: { ignored: ['**/dist/**'] } },
  test: {
    bail: 1,
    logHeapUsage: true,
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      // all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/types',
        'src/temp',
        'src/build',
        'src/tests',
        'src/cli',
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
