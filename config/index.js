// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

// 切换代理环境
// var curPath='dev'
var curPath='test'

module.exports = {
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    port: 8000,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    host: '0.0.0.0',
    assetsPublicPath: '/',
    proxyTable: {
      '/br': {
        // 开发
        target: 'http://brf.br-app.'+curPath+'3.fzyun.io',
        // target: 'http://172.19.36.79:8083/br',
        changeOrigin: true,
      },
      '/cm': {
        target: 'http://brf.br-app.'+curPath+'3.fzyun.io/',
        changeOrigin: true,
      },
      '/etl': {
        target: 'http://brf.br-app.'+curPath+'3.fzyun.io',
        changeOrigin: true,
      },
      '/base': {
        target: 'http://base.br-base.'+curPath+'3.fzyun.io',
        changeOrigin: true,
      },
      '/imgUrl': {
        target: 'http://go-fast.br-base.'+curPath+'3.fzyun.io/',
        changeOrigin: true,
        pathRewrite: {
          '^/imgUrl': ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
