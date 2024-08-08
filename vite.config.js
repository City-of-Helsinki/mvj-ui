import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import path from 'path';
import postcssUrl from 'postcss-url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    commonjs(),
  ],
  css: {
    postcss: {
      plugins: [
        postcssUrl({
          url: (asset) => {
            if (asset.relativePath && !['src', 'assets'].includes(asset.relativePath.split('/')[0])) {
              return `/assets/${asset.url}`;
            }
            return asset.url;
          }
        }),
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
  },},
  define: {
    'global': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 3000,
  }
})
