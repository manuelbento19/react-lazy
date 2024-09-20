import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.tsx",
      formats: ['es'],
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React"
        }
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
})
