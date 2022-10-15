import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/flapjs/',
  resolve: {
    alias: [
      { find: 'src', replacement: path.resolve('.', 'src') },
    ]
  },
  server: {
    fs: {
      // NOTE: To serve other workspace module files.
      allow: ['../..']
    }
  },
  plugins: [
    svgr({
      exportAsDefault: true,
    }),
    react(),
  ]
});
