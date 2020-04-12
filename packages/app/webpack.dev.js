/* eslint import/no-extraneous-dependencies: off */
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  entry: {
    index: [`webpack-hot-middleware/client?path=
    /__webpack_hmr&timeout=20000&reload=true`]
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        'style-loader',
        'css-loader', 'postcss-loader', 'sass-loader'
      ],
    },
    ]
  },
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, 'client/dist'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 9000
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
});
