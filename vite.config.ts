import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import path from "path"
import pkg from "./package.json"

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Every peer dependency must stay external, including its subpath imports
// (e.g. react/jsx-runtime). Matching exact names only bundles a second copy
// of React into dist and leaks process.env.NODE_ENV into the ESM output.
const external = [
    new RegExp(
        `^(${Object.keys(pkg.peerDependencies).map(escapeRegExp).join("|")})(/.*)?$`
    )
]

export default defineConfig({
    plugins: [
        react(),
        dts({
            outDirs: ["dist"],
            entryRoot: "src",
            insertTypesEntry: true,
            tsconfigPath: path.resolve(__dirname, "tsconfig.json")
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            // The package is ESM ("type": "module"), so CommonJS needs an
            // explicit .cjs extension to be loaded as CJS.
            fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js")
        },
        rollupOptions: {
            external,
            output: {
                exports: "named"
            }
        }
    }
})