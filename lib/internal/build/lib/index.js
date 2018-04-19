'use strict';

const webpack = require('webpack');
const Builder = require('./builder');
const config = require('./config');

function getWebpackConfig() {
    return config.getConfig()
        .then((data) => {
            console.log('config.getConfig then', data);

            return Builder.createProdConfig(data);
        });
}

function runBuild(webpackConfig) {
    webpack(webpackConfig, (err, stats) => {
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
