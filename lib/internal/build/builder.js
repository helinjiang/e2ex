'use strict';

const builderWebpack3 = require('./lib');

exports.dev = function (args) {
    return builderWebpack3('dev');
};

exports.build = function (args) {
    console.log(args);
    let isSimpleBuild = !!args.s;

    builderWebpack3.getWebpackConfig({ isSimpleBuild: isSimpleBuild })
        .then((webpackConfig) => {
            console.log('webpackConfig', webpackConfig);

            builderWebpack3.runBuild(webpackConfig);
        })
        .catch((err) => {
            throw err;
        });
};
