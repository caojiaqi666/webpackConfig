const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// d定义nodejs环境变量，决定使用哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              require: "postcss-preset-env",
            },
          ],
        ],
      },
    },
  },
];

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "built.js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/i,
        use: [...commonCssLoader, "less-loader"],
      },
      // eslint优化代码
      // {
      //   test: /\.js$/i,
      //   exclude: /node_modules/,
      //   loader: ESLintPlugin.loader,
      // },
      // 兼容性处理
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            // npm i babel-loader @babel/core @babel/preset-env core-js
            // 只能做简单的兼容处理
            // "@babel/preset-env",
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: { version: 3 },
                // 指定兼容到哪个版本
                targets: {
                  chrome: "60",
                  firefox: "60",
                  ie: 9,
                  safari: "10",
                  edge: "17",
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          output: "imgs",
          esModule: false
        },
      },
      // 处理html中的图片文件，插件处理不了
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          esModule: false
        }
      },
      // 其他文件
      {
        exclude: /\.(js|css|less|png|jpg|svg|gif|html)$/,
        loader: "file-loader",
        options: {
          outputPath: "media"
        }
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/built.css",
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    // new ESLintPlugin({
    //   extensions: "js",
    //   exclude: ["node_modules"],
    //   fix: true,
    //   formatter: "stylish",
    // }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        // 去除html注释
        removeComments: true
      }
    })
  ],
  mode: "production",
};
