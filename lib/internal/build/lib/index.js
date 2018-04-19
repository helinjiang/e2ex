'use strict';

const webpack = require('webpack');
const Builder = require('./builder');
const config = require('./config');

function getWebpackConfig(opts) {
    return config.getConfig()
        .then((data) => {
            console.log('config.getConfig then', data);

            return Builder.createProdConfig(data, opts);
        });
}

function runBuild(webpackConfig) {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw err;
        }

        console.log(stats.toString({
            chunks: false,
            colors: true,
            children: false
        }));
    });
}

module.exports = {
    getWebpackConfig: getWebpackConfig,
    runBuild: runBuild
};
