const path = require('path');

const tsLoaderMatcher = function(rule) {
  return rule.loader && rule.loader.indexOf(`ts-loader${path.sep}`) !== -1;
};

const getLoader = function(rules, matcher) {
  let loader;

  rules.some(rule => {
    return (loader = matcher(rule)
      ? rule
      : getLoader(rule.use || rule.oneOf || [], matcher));
  });

  return loader;
};

const getTsLoader = function(rules) {
  return getLoader(rules, tsLoaderMatcher);
};

module.exports = (config, useBabel = false, babelPlugins = ['react-hot-loader/babel']) => {
  const tsLoader = getTsLoader(config.module.rules);
  if (!tsLoader) {
    console.log('ts-loader not found');
    return config;
  }

  // Replace loader with array of loaders with  use: []
  delete tsLoader.loader;
  if (useBabel) {
    tsLoader.use = [{
      loader: require.resolve('babel-loader'),
      options: {
        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        cacheDirectory: true,
        plugins: babelPlugins
      }
    }]
  } else {
    tsLoader.use = [require.resolve('react-hot-loader/webpack')]
  }

  tsLoader.use = [...tsLoader.use, require.resolve('ts-loader')];

  return config;
}
