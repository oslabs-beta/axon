const path = require('path');

module.exports = {
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: {
    // replaces import path ./../ for @ 
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    // resolve imports missing extensions
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ 
        loader: 'babel-loader',
        options: {
        presets: [ '@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
      }
}]
    }]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  }
}