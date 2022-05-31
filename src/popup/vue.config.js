const { defineConfig } = require('@vue/cli-service')
module.exports = {
  lintOnSave:false,
  productionSourceMap:false,
  publicPath:'/',
  outputDir:'../../popup',
  indexPath:'popup.html',
  filenameHashing: false,
}
