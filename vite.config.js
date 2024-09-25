import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import path from 'path';
import postcssUrl from 'postcss-url';
import babel from '@rollup/plugin-babel';

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
  css: {
    postcss: {
      plugins: [
        postcssUrl({}),
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
  },
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
    coverage: {
      provider: 'istanbul'
    },
  },
  build: {
    minify: false,
  }
})
