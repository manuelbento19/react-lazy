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
        pool: "threads",
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
        setupFiles: ["./test/setup.ts"],
        include: ["test/**/*.test.{ts,tsx}"]
    }
})
