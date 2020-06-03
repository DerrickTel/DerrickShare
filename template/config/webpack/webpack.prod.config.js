const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: 'public/index.html',
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),

    new CleanWebpackPlugin()
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        },
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: "vendor",
          enforce: true,
        },
      }
    }
  },
});
/**
 * filename：打包之后的html文件名字
template：以我们自己定义的html为模板生成，不然我们还要到打包之后的html文件中写
inject：在body最底部引入js文件，如果是head，就是在head中引入js
minify：压缩html文件，更多配置点我

removeComments：去除注释
collapseWhitespace：去除空格
 */