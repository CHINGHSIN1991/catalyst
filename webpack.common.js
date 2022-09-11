const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: {
    popup: path.resolve('src/popup/Popup.tsx'),
    options: path.resolve('src/options/options.tsx'),
    newtab: path.resolve('src/newtab/newtab.tsx'),
    background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/contentScript/contentScript.tsx'),
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx|ts?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/, // to import images and fonts
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
        },
      ],
    }),
    new Dotenv(),
    ...getHtmlPlugins(['popup', 'options', 'newtab']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript'
      },
    },
  },
}

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'Catalyst',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  )
}

// new webpack.DefinePlugin({
//   PRODUCTION: JSON.stringify(true),
//   VERSION: JSON.stringify('5fa3b9'),
//   BROWSER_SUPPORTS_HTML5: true,
//   TWO: '1+1',
//   'typeof window': JSON.stringify('object'),
//   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
// });
