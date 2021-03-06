const fs = require('fs')
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
const version = packageJson.version || 0
const appName = packageJson.name || 'rfid-security-ui'
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.PACKAGE_VERSION': JSON.stringify(version),
            'process.env.PACKAGE_NAME': JSON.stringify(appName),
        })
    ],
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
        target: process.env.VUE_APP_PROXY_TARGET || 'http://rfidsecuritysvc:5000',
        headers: {
          'X-RFIDSECURITYSVC-API-KEY': process.env.VUE_APP_RFID_API_KEY
        },
      },
    },
  },
}
