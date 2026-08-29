import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      'cloudflare:workers': fileURLToPath(
        new URL('./src/test/cloudflare-workers-mock.ts', import.meta.url),
      ),
    },
  },
  plugins: [tailwindcss(), viteReact()],
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
  },
})
