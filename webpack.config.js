const path = require("path");
// const DonePlugin = require("./plugins/DonePlugin");
// const AsyncPlugin = require("./plugins/AsyncPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileListPlugin = require("./plugins/FileListPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InlineSourcePlugin = require("./plugins/InlineSourcePlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    // new DonePlugin(),
    // new AsyncPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new FileListPlugin({
      filename: "list.md"
    }),
    new MiniCssExtractPlugin({
      filename: "main.css"
    }),
    new InlineSourcePlugin({
      reg: /\.(js|css)$/
    })
  ]
};
