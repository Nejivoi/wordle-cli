const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  stats: "none",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "bin"),
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
};
