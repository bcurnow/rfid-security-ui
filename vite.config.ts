import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next/resolvers'


// Read version and name directly from package.json
const { version, name } = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion: string = version ?? '0'
const appName: string = name ?? 'rfid-security-ui'

export default defineConfig(({ mode }) => {
  // Load .env variables for the current mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      Components({
        dirs: ['src/components', 'src/views/common', 'src/*.ts', 'src/*.vue'],
        extensions: ['vue'],
        deep: true,
        dts: true,
        resolvers: [
          BootstrapVueNextResolver(),
          (name: string) => name === 'VueFeather' ? { name: 'default', from: 'vue-feather' } : undefined,
        ],
        directoryAsNamespace: true,
      }),
      AutoImport({
        imports: ['vue', 'vue-router'], // Automatically imports useRoute, useRouter, etc.
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // Expose package.json values as statically-replaced constants
    // Access in code via: import.meta.env.VITE_PACKAGE_VERSION
    define: {
      'import.meta.env.VITE_PACKAGE_VERSION': JSON.stringify(appVersion),
      'import.meta.env.VITE_PACKAGE_NAME': JSON.stringify(appName),
    },

    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: true,
      allowedHosts: env.VITE_ALLOWED_HOSTS
        ? env.VITE_ALLOWED_HOSTS.split(',')
        : true,
            hmr: env.VITE_HMR_HOST
        ? {
            host: env.VITE_HMR_HOST,
            clientPort: env.VITE_HMR_CLIENT_PORT ? Number(env.VITE_HMR_CLIENT_PORT) : 8080,
          }
        : true,
      // Disable watch/live reload via VITE_LIVE_RELOAD=false
      watch: env.VITE_LIVE_RELOAD === 'false' ? { ignored: ['**/*'] } : undefined,

      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET ?? 'http://localhost:5000',
          changeOrigin: true,
          headers: {
            'X-RFIDSECURITYSVC-API-KEY': env.VITE_RFID_API_KEY ?? '',
          },
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})