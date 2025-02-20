import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  // server: {
  //   port: 5175,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5174',
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
