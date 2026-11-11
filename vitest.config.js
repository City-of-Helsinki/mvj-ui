import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/leasing/vite.config.js',
      'apps/landuse/vite.config.js',
      { test: { name: 'shared', root: './shared', environment: 'jsdom' } },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
      include: ['apps/**/src/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}'],
      exclude: ['**/*.{test,spec}.{ts,tsx}', '**/*.d.ts'],
    },
  },
});
