'use strict';

const builderWebpack3 = require('./lib');

exports.dev = function (args) {
    return builderWebpack3('dev');
};

exports.build = function (args) {
    builderWebpack3.getWebpackConfig()
        .then((webpackConfig) => {
            builderWebpack3.runBuild(webpackConfig);
        })
        .catch((err) => {
            throw err;
        });
};
