const webpack = require('webpack')
module.exports = {
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ]
  }
}
