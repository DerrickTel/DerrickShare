const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包之后的html文件名字
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: 'public/index.html', // 以我们自己定义的html为模板生成，不然我们还要到打包之后的html文件中写script
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      minify: { // 压缩html文件
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去除空格
      },
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i, // 测试匹配文件,
        // include: /\/includes/, //包含哪些文件
        // excluce: /\/excludes/, //不包含哪些文件

        cache: false, // 是否启用文件缓存，默认缓存在node_modules/.cache/uglifyjs-webpack-plugin.目录
        parallel: true, // 使用多进程并行运行来提高构建速度

        // 允许过滤哪些块应该被uglified（默认情况下，所有块都是uglified）。
        // 返回true以uglify块，否则返回false。
        chunkFilter: (chunk) => {
          // `vendor` 模块不压缩
          if (chunk.name === 'vendor') {
            return false;
          }
          return true;
        },
      }),
    ],
    splitChunks: {
      /**
       * 默认值是async
       * 拆分模块的范围，它有三个值async、initial和all。
       * async表示只从异步加载得模块（动态加载import()）里面进行拆分
       * initial表示只从入口模块进行拆分
       * all表示以上两者都包括
       */
      chunks: 'all',
      // minSize: 30000, // 生成chunk的最小大小（以字节为单位）。只有大于这个数字才可以成一个chunk
      // minRemainingSize: 0, // 只有剩下一个chunk的时候才会生效，默认是和minSize一样的，开发的时候默认是0
      // maxSize: 0, // 告诉webpack尝试将大于maxSize字节的块拆分为较小的部分。
      // minChunks: 1, // 拆分前必须共享模块的最小块数。
      // maxAsyncRequests: 6, // 按需加载时最大并行请求数。
      // maxInitialRequests: 4, // 入口点的最大并行请求数。入口文件
      // automaticNameDelimiter: '~', // 默认情况下，webpack将使用块的来源和名称生成名称（例如vendors~main.js）。
      // 此选项使您可以指定用于生成名称的定界符。
      cacheGroups: {
        /**
         * 当webpack处理文件路径时，它们始终包含/在Unix系统和\Windows上。
         * 这就是为什么[\\/]在{cacheGroup}.test字段中使用in 来表示路径分隔符的原因。
         * /或\in {cacheGroup}.test会在跨平台使用时引起问题。
         */
        // defaultVendors: {
        //   test: /[\\/]node_modules[\\/]/, // 分块目标
        //   priority: -10 // 权重
        // },
        // default: {
        //   minChunks: 2, // 最小引用
        //   priority: -20, // 权重
        //   // 如果当前块包含已从主捆绑包中拆分出的模块，则将重用该模块，而不是生成新的模块。这可能会影响块的结果文件名。
        //   reuseExistingChunk: true
        // },
        // 上述的splitChunks全是webpack4未设置情况下的默认值，除了chunks从【async】->【all】其他都没有改
        // ok，我们现在加入我们自己想要的代码分割
        // 因为我准备加入react等业务千变万化而不会变的库
        common: {
          test: 'common', // webpack扫面的关键字
          name: 'common', // 生成的名字
          enforce: true, // 是否缓存
        },
      },
    },
  },
});
