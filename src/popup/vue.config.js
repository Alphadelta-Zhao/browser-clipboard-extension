const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: false,
  lintOnSave:false,
  productionSourceMap:false,
  publicPath:'./',
  outputDir:'../../dist/new/popup',
  indexPath:'popup.html',
  filenameHashing: false,
  assetsDir: '',
}
