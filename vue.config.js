module.exports = {
  devServer: {
    host: '0.0.0.0',
    hot: true,
    public: process.env.WEBPACK_PUBLIC || 'devpi.local',
    historyApiFallback: true,
    disableHostCheck: process.env.WEBPACK_DISABLE_HOST_CHECK == 'true' || false,
    reload: false,
  },
}
