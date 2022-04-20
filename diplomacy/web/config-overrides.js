const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function override(config, env) {

    if (!config.plugins) {
        config.plugins = [];
    }
    
    config.plugins.push(
        new BundleAnalyzerPlugin()
    );

    return config;
};
