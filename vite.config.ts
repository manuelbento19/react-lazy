import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import path from "path"
import pkg from "./package.json"

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const external = [
    new RegExp(
        `^(${Object.keys(pkg.peerDependencies).map(escapeRegExp).join("|")})(/.*)?$`
    )
]

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ["src"],
            outDirs: ["dist"],
            entryRoot: "src",
            insertTypesEntry: true,
            tsconfigPath: path.resolve(__dirname, "tsconfig.json")
        })
    ],
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, "src/index.ts"),
                virtual: path.resolve(__dirname, "src/virtual/index.ts")
            },
            formats: ["es", "cjs"],
            fileName: (format, entryName) => (format === "cjs" ? `${entryName}.cjs` : `${entryName}.js`)
        },
        rollupOptions: {
            external,
            output: {
                exports: "named"
            }
        }
    }
})