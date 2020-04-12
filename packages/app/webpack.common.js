/* eslint import/no-extraneous-dependencies: off */
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import HtmlWebpackHarddiskPlugin from "html-webpack-harddisk-plugin";
import HtmlWebpackExternalsPlugin from "html-webpack-externals-plugin";

export default {
  entry: {
    index: [path.resolve(__dirname, "client/src/index.jsx")]
  },
  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: "images/[hash]-[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(js|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CLOUDINARY_URL: JSON.stringify(process.env.CLOUDINARY_URL),
        CLOUDINARY_UPLOAD_PRESET: JSON.stringify(
          process.env.CLOUDINARY_UPLOAD_PRESET
        ),
        CLOUDINARY_API_KEY: JSON.stringify(process.env.CLOUDINARY_API_KEY)
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "client/public/index.html"),
      filename: "index.html",
      inject: true,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "jquery",
          entry: "https://unpkg.com/jquery@3.3.1/dist/jquery.min.js",
          global: "jQuery"
        },
        {
          module: "materialize",
          // eslint-disable-next-line
          entry:
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js",
          global: "M"
        }
      ]
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CopyWebpackPlugin([
      {
        from: "client/public/images",
        to: "images"
      }
    ]),
    new webpack.ProvidePlugin({
      M: "materialize",
      Materialize: "materialize",
      "window.M": "materialize"
    })
  ]
};
