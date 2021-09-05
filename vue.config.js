module.exports = {
  devServer: {
    disableHostCheck: process.env.WEBPACK_DISABLE_HOST_CHECK == 'true' || false,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    liveReload: process.env.WEBPACK_LIVE_RELOAD == 'true' || false,
    public: process.env.WEBPACK_PUBLIC || 'localhost:8080',
    proxy: {
      '/api': {
        target: 'http://rfidsecuritysvc:5000',  
      },
    },
  },
}
