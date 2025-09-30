import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'game-core': ['./src/core/Game'],
          'game-systems': [
            './src/systems/MapManager',
            './src/systems/QuestManager',
            './src/systems/GameStateManager'
          ]
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});