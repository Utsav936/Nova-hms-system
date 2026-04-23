import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Binds to all network interfaces
    strictPort: true,
    watch: {
      usePolling: true, // Fallback for Windows file system watchers
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Use explicit IPv4 to prevent proxy timeouts
        changeOrigin: true,
      },
    },
  },
});
