const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: false,
  lintOnSave:false,
  productionSourceMap:true,
  publicPath:'./',
  outputDir:'../../popup',
  indexPath:'popup.html',
  filenameHashing: false,
  assetsDir: '',
}
