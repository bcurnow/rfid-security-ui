import type { Config } from './config.types'

const config: Config = {
  appVersion: '',
  production: false,
  apiUrl: import.meta.env.VITE_RFID_API_URL ?? '/api/v1.0/'
}

export default config
