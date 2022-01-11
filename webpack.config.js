const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'frontend/src/components'),
      Actions: path.resolve(__dirname, 'frontend/src/actions'),
      Reducers: path.resolve(__dirname, 'frontend/src/reducers'),
      Selectors: path.resolve(__dirname, 'frontend/src/selectors'),
      Api: path.resolve(__dirname, 'frontend/src/api'),
      Utils: path.resolve(__dirname, 'frontend/src/utils')
    },
    extensions: ['.js', '.jsx', '.scss', '.css']
  }
}
