import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set "base" to your GitHub repo name when deploying to GitHub Pages
// e.g. base: '/invoice-generator/'
export default defineConfig({
  plugins: [react()],
  base: './',
})
