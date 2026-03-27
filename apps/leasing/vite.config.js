import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import postcssUrl from 'postcss-url';
import babel from '@rollup/plugin-babel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '../..');

function patchReactLeafletDrawImports() {
  return {
    name: 'patch-react-leaflet-draw-imports',
    enforce: 'pre',
    transform(code, id) {
      if (
        id.includes('node_modules/react-leaflet-draw/') &&
        code.includes("import Draw from 'leaflet-draw';")
      ) {
        return code.replace(
          /import Draw from ['\"]leaflet-draw['\"];?/g,
          "import * as Draw from 'leaflet-draw';"
        );
      }
      return code;
    },
  };
}

export default defineConfig({
  root: __dirname,
  plugins: [
    patchReactLeafletDrawImports(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(workspaceRoot, 'node_modules/leaflet-draw/dist/images/*'),
          dest: 'assets/images',
        },
      ],
    }),
    react({ jsxRuntime: 'classic' }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
      include: [/node_modules\/react-foundation\/.*/],
      only: [/node_modules\/react-foundation\/.*/],
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
  ],
  build: {
    target: 'baseline-widely-available',
    outDir: path.resolve(workspaceRoot, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true,
      },
    },
    postcss: {
      plugins: [
        postcssUrl({
          url: (asset) => {
            if (asset.relativePath && asset.relativePath.startsWith('images/')) {
              return `/assets/${asset.url}`;
            }
            return asset.url;
          },
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    global: {},
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
