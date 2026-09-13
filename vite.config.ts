import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5174, // Choose 5174 so it doesn't conflict with 5173 if the other game is running
    cors: true
  }
});
