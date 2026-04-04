/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PACKAGE_NAME: string
  readonly VITE_PACKAGE_VERSION: string
  readonly VITE_RFID_API_URL: string
  readonly VITE_PROXY_TARGET: string
  readonly VITE_RFID_API_KEY: string
  readonly VITE_HMR_HOST: string
  readonly VITE_HMR_CLIENT_PORT: string
  readonly VITE_LIVE_RELOAD: string
  readonly VITE_ALLOWED_HOSTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}