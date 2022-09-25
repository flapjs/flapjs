import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/flapjs/',
  resolve: {
    alias: [
      { find: 'src', replacement: path.resolve('.', 'src') },
    ]
  },
  plugins: [react()]
});
