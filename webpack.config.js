const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/extension.js',
  output: {
    filename: 'popup-bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "util": false,
      "fs": false,
      "path": false
    }
  }
};