import { type Config } from './config.types'

const env: string = import.meta.env.MODE ?? 'development'

const config: Config = (await import(`./config.${env}.ts`)).default

export default config