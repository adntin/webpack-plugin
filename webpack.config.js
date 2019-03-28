const path = require("path");
// const DonePlugin = require("./plugins/DonePlugin");
// const AsyncPlugin = require("./plugins/AsyncPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileListPlugin = require("./plugins/FileListPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    // new DonePlugin(),
    // new AsyncPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new FileListPlugin({
      filename: "list.md"
    })
  ]
};
