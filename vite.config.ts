import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
  },
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'Panelize',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'panelize.es.js' : 'panelize.cjs'),
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id === 'styled-components' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id.startsWith('styled-components/'),
      output: {
        banner: "'use client'",
        globals: { react: 'React', 'react-dom': 'ReactDOM', 'styled-components': 'styled' },
      },
    },
  },
})
