/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

module.exports = {
  entry: {
    index: ['@babel/polyfill', './src/index.tsx'],
    framework: ['react', 'react-dom'],
  },
  output: {
    // 8是hash的长度，如果不设置，webpack会设置默认值为20。
    filename: 'js/[name].[chunkhash:8].bundle.js',
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
    rules: [
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
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
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }
      },
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
        test: /\.jsx?$/,
        // 开启缓存
        options: { cacheDirectory: true },
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'postcss-loader'
        ],
        include: /node_modules/
      },
      {
        test: /\.module\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              ident: 'postcss',
            },
          },
          'less-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ],
        exclude: [/\.module\.less$/]
      },
    ]
  }
}