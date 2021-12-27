// vue.config.js
module.exports = {
  lintOnSave: true,
  devServer: {
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: true
    }
  }
};
