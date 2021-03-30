module.exports = (config, webpack) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(scss|sass)$/,
          use: [
            'css-loader',
            'sass-loader'
          ],
        }
      ],
    },
    plugins: [
      ...config.plugins,
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  }
}