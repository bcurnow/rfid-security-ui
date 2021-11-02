const env = process.env.NODE_ENV || 'development'

let config = require(`./config.${env}.js`).default
export default config
