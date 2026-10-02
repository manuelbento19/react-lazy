import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        environmentOptions: {
            jsdom: {
                url: "http://localhost",
            },
        },
        pool: "vmThreads",
        poolOptions: {
            vmThreads: {
                singleThread: true,
            },
        },
        setupFiles: ["./test/setup.ts"],
        include: ["test/**/*.test.{ts,tsx}"]
    }
})
