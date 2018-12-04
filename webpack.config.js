const path = require('path')
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  target: "node",
  entry: path.join(__dirname, 'src/server.ts'),
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
  module:{
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(path.join(__dirname, 'dist'),)
  ]
}