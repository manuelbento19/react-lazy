import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.tsx",
      name: "react-lazy",
      fileName: (format) => `index.${format}.js`,
      formats: ["es","cjs"]
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React"
        }
      }
    }
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
})
