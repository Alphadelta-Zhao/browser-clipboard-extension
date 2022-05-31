const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: false,
  lintOnSave:false,
  productionSourceMap:false,
  publicPath:'./',
  outputDir:'../../popup',
  indexPath:'popup.html',
  filenameHashing: false,
  assetsDir: '',
}
