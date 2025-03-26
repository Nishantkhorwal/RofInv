import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '', // 👈 Ensures correct relative paths for Hostinger
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',  // 👈 Ensures correct file structure
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
