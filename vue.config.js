const fs = require('fs')
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
const version = packageJson.version || 0
const appName = packageJson.name || 'rfid-security-ui'
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
      plugins: [
          new webpack.DefinePlugin({
              'process.env': {
                  PACKAGE_VERSION: '"' + version + '"',
                  PACKAGE_NAME: '"' + appName + '"',
              }
          })
      ]
  },
  devServer: {
    disableHostCheck: process.env.WEBPACK_DISABLE_HOST_CHECK === 'true' || false,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    liveReload: process.env.WEBPACK_LIVE_RELOAD === 'true' || false,
    public: process.env.WEBPACK_PUBLIC || 'localhost:8080',
    proxy: {
      '/api': {
        target: 'http://rfidsecuritysvc:5000',
      },
    },
  },
}
