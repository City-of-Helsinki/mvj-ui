import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/leasing/vite.config.js',
      'apps/landuse/vite.config.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
      include: ['apps/**/src/**/*.{ts,tsx}'],
      exclude: ['apps/**/src/**/*.{test,spec}.{ts,tsx}', 'apps/**/src/**/*.d.ts'],
    },
  },
});
