import { fileURLToPath, URL } from 'node:url'
import { defineConfig, Plugin } from 'vite'
import { buildSync } from 'esbuild'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { join } from 'path'

function postBuildWorker(): Plugin {
  return {
    name: 'post-build-worker',
    apply: 'build',
    enforce: 'post',
    writeBundle() {
      buildSync({
        minify: true,
        bundle: true,
        entryPoints: [join(process.cwd(), 'src', 'firebase-messaging-sw.ts')],
        outfile: join(process.cwd(), 'dist', 'firebase-messaging-sw.js'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), postBuildWorker(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
})
