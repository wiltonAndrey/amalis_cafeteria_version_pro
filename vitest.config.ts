import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            all: true,
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/test/**', 'src/index.tsx'],
            lines: 90,
            functions: 90,
            statements: 90,
            branches: 90,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        }
    }
})
