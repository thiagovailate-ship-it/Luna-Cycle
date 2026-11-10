import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGithubPages = process.env.GITHUB_ACTIONS === 'true' && process.env.CAPACITOR_BUILD !== 'true'

export default defineConfig({
  base: process.env.VITE_BASE ?? (isGithubPages ? '/Luna-Cycle/' : '/'),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
})
