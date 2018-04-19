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

            builderWebpack3.runBuild(webpackConfig, () => {

                // 如果是非简单模式下，则为打包之后的文件手动增加 nightmare client script
                if (!isSimpleBuild) {

                }
                // 手动增加 nightmare client script
                // hexoFS.readFile(path.join(__dirname, './nightmare-preload.js'))
                //     .then((script) => {
                //         console.log('then', script);
                //         nightmarePreloadScript = script;
                //
                //         source = script + ';' + source;
                //
                //         callback(null, source);
                //     })
                //     .catch((err) => {
                //         console.log('catch', err);
                //         callback(null, source);
                //     });
            });
        })
        .catch((err) => {
            throw err;
        });
};
