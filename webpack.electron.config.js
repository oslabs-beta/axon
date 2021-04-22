const path = require('path');

module.exports = {
  // Build Mode
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  // devtool: "source-map",
  resolve: {
    // replaces import path ./../ for @ 
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    // resolve imports missing extensions
    extensions: ['.tsx', '.ts', '.js', '.jsx'], /* maybe?? .jsx */
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