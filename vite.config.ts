/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React"
        },
        entryFileNames: '[name].js'
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.tsx"]
    })
  ],
})
