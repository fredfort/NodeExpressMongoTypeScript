const path = require('path')
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const buildFolder = path.resolve(__dirname, 'build')

module.exports = {
  mode: 'production',
  target: "node",
  entry: path.join(__dirname, 'src/server.ts'),
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'server.js',
    path: buildFolder
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
    new CleanWebpackPlugin(buildFolder)
  ]
}