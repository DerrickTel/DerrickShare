const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包之后的html文件名字
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: 'public/index.html', // 以我们自己定义的html为模板生成，不然我们还要到打包之后的html文件中写script
      inject: 'body',// 在body最底部引入js文件，如果是head，就是在head中引入js
      minify: { // 压缩html文件
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去除空格
      },
    }),
    new CleanWebpackPlugin()
  ]
});