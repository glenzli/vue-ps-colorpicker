module.exports = {
  publicPath: './',
  chainWebpack: config => {
    if (process.env.NODE_ENV = 'production') {
      if (!process.env.DEMO_TARGET) {
        config.externals({
          'direct-object': 'direct-object',
          'vue': 'vue',
          'core-js': 'core-js'
        })
      } else {
        config.externals({
          'vue': 'Vue'
        })
      }
    }
  }
}
