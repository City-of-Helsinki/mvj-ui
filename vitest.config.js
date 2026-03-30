import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/leasing/vite.config.js',
      'apps/landuse/vite.config.js',
    ],
  },
});
