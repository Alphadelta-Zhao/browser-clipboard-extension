const { resolve } = require('path');
module.exports = {
    entry:{
        background: './src/background.js',
        ['content-script']: './src/content-script.js'
    },
    output:{
        filename: '[name].js',
        path: resolve(__dirname,'dist','new')
    },
    mode: 'production'
}