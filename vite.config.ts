import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import stripComments from 'vite-plugin-strip-comments'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    stripComments({ type: 'none' }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }), 
    viteReact(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
