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
      Selectors: path.resolve(__dirname, 'frontend/src/selectors'),
      Store: path.resolve(__dirname, 'frontend/src/store'),
      Queries: path.resolve(__dirname, 'frontend/src/queries'),
      Api: path.resolve(__dirname, 'frontend/src/api'),
      Utils: path.resolve(__dirname, 'frontend/src/utils')
    },
    extensions: ['.js', '.jsx', '.scss', '.css']
  }
}
