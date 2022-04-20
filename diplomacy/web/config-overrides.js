const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';

module.exports = function override(config, env) {

    if (!isProd) {
        
        if (!config.plugins) {
            config.plugins = [];
        }

        config.plugins.push(
            new BundleAnalyzerPlugin()
        );
    }

    return config;

};
