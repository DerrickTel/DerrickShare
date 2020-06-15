const path = require('path');

module.exports = {
  // 配置入口文件
  entry: {
    app: './src/index.tsx',
  },
  // 打包 之后的出口
  output: {
    // 如果不加哈希值，浏览器会有缓存，可能你部署了，但是用户看到的还是老页面
    // 8是hash的长度，如果不设置，webpack会设置默认值为20。
    filename: 'js/[name].[chunkhash:8].bundle.js',
    /**
     * Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径，
     * 所以当你在 /d1/d2/myscript.js 文件中写了 __dirname， 它的值就是 /d1/d2 。
     * path.resolve
     * 1.path.resolve()方法可以将路径或者路径片段解析成绝对路径
     * 2.传入路径从右至左解析，遇到第一个绝对路径是完成解析，例如path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz
     * 3.如果传入的绝对路径不存在，那么当前目录将被使用
     * 4.当传入的参数没有/时，将被传入解析到当前根目录
     * 5.零长度的路径将被忽略
     * 6.如果没有传入参数，将返回当前根目录
     * 
     * _dirname表示绝对路径
     * 我们碰到的./xx就是相对路径
     * 1.只传入__dirname也可以自动调用path.resolve方法
     * 2.可以拼接路径字符串，但是不调用path.resolve()方法拼接失败
     * 3.__dirname代表的是当前文件（a.js）的绝对路径
     * 4.从右至左解析，遇到了绝对路径/src，因此直接返
     */
    path: path.resolve(__dirname, '../../dist')
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    /**
     * test 规定了作用于以规则中匹配到的后缀结尾的文件， 
     * use 即是使用 babel-loader 必须的属性， 
     * exclude 告诉我们不需要去转译"node_modules"这里面的文件。
     */
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          // 开启缓存
          cacheDirectory: true,
          presets: ['@babel/preset-typescript'],
          plugins: [
            ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
          ],
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 这里设置为false
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192,
          },
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
        include: /node_modules/
      },
      {
        test: /\.less$/,
        use: [ 
          'style-loader',
          'css-loader', 
          'less-loader',
          'postcss-loader'
        ],
        include: /node_modules/
      },
      {
        test: /\.less$/,
        use: [ 
          'style-loader',{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]_[hash:base64:8]'
            }
          },
          'less-loader',
          'postcss-loader'
        ],
        exclude: /node_modules/,
      },
    ]
  }
}