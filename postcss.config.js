module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 3 versions', 'ie 8']
    })
  ]
};
