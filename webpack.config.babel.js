export default {
  entry: './src/index.js',
  output: {
    path: `${__dirname}/dist`,
    libraryTarget: 'umd',
    library: '$',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'expose-loader?mjQuery!expose-loader?jQuery!babel-loader' },
    ],
  },
};
