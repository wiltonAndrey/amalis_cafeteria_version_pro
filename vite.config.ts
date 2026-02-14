import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }

          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
