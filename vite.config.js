import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const generationWebhookUrl = env.VITE_GENERATION_WEBHOOK_URL
  const generationWebhook = generationWebhookUrl ? new URL(generationWebhookUrl) : null
  const generationProxy = generationWebhook
    ? {
        '/api/generate-questions': {
          target: generationWebhook.origin,
          changeOrigin: true,
          secure: true,
          rewrite: () => `${generationWebhook.pathname}${generationWebhook.search}`,
        },
      }
    : {}

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: true,
      proxy: generationProxy,
    },
    preview: {
      host: true,
      allowedHosts: true,
      proxy: generationProxy,
    },
  }
})
