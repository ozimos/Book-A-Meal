/* eslint import/no-extraneous-dependencies: off */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import merge from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader', 'postcss-loader', 'sass-loader'
      ],
    },
    ]
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
});
