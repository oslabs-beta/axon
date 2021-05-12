const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { loader } = require("@monaco-editor/react");

loader.config({ paths: { vs: "../path-to-monaco" } });
 
module.exports = {
  entry: './src/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist/renderer.js'),
    compress: true,
    port: 9000
  },
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    mainFields: ["main", "module", "browser"],
  },
  module: {
    rules: [

      {
        test: /\.ts(x?)$/,
        include: /src/,
    
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: "file-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'renderer.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),

  ]
};