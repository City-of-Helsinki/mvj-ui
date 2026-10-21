import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcssUrl from 'postcss-url';
import babel from '@rollup/plugin-babel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
      include: ['node_modules/react-foundation/**'],
      only: ['node_modules/react-foundation/**'],
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    }),
  ],
  build: {
    target: 'baseline-widely-available',
    rollupOptions: {
      input: {
        leasing: path.resolve(__dirname, 'apps/leasing/index.html'),
        landuse: path.resolve(__dirname, 'apps/landuse/index.html'),
      },
      output: {
        format: 'es',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true
      }
    },
    postcss: {
      plugins: [
        postcssUrl({
          url: (asset) => {
            if (asset.relativePath && asset.relativePath.startsWith('images/')) {
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
    sourcemap: true,
  },
})
