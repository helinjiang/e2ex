'use strict';

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');

const builderWebpack3 = require('./lib');

let nightmarePreloadScript;

exports.dev = function (args) {
    return builderWebpack3('dev');
};

exports.build = function (args) {
    // console.log(args);

    let isSimpleBuild = !!args.s;

    builderWebpack3.getWebpackConfig()
        .then((webpackConfig) => {
            // console.log('webpackConfig', webpackConfig);

            let configParams = webpackConfig._configParams;

            builderWebpack3.runBuild(webpackConfig, () => {
                // 如果是非简单模式下，则为打包之后的文件手动增加 nightmare client script
                if (!isSimpleBuild) {
                    prependNightmareClientJS(configParams.distPath);
                }
            });
        })
        .catch((err) => {
            throw err;
        });
};

function prependNightmareClientJS(distPath) {
    new Promise((resolve, reject) => {
        if (nightmarePreloadScript) {
            return resolve(nightmarePreloadScript);
        }

        fs.readFile(path.join(__dirname, './lib/nightmare-preload.js'), 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    })
        .then((code) => {
            console.log('\nNext to prepend Nightmre client script...');

            let globResult = glob.sync(path.resolve(distPath, './**/**.js'));

            globResult.forEach((item) => {

                // console.log(item);

                fs.readFile(item, 'utf8', (err, data) => {
                    if (err) {
                        console.log('read file err!', item, err);
                        return;
                    }

                    fse.outputFile(item, code + ';' + data, err => {
                        if (err) {
                            console.error('prepend fail!', item, err);
                        } else {
                            console.log('prepend success!', item);
                        }
                    });
                });
            });

        });
}