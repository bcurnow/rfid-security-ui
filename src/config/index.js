const env = process.env.NODE_ENV || 'local'

let config = require(`./config.${env}.js`).default
export default config
