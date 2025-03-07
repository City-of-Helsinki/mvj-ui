import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import postcssUrl from 'postcss-url';
import babel from '@rollup/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { // copy leaflet-draw images to dist
          src: 'node_modules/leaflet-draw/dist/images/*',
          dest: 'assets/images'
        },
      ]
    }),
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
        postcssUrl({
          url: (asset) => {
            // transform urls from `node_modules/leaflet-draw/dist/leaflet.draw.css`
            // change those urls to point from `/images` to `/assets/images`
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
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
    coverage: {
      provider: 'istanbul'
    },
  }
})
