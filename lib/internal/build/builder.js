'use strict';

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');

const builderWebpack3 = require('./builder-webpack3');
const builderBabel = require('./builder-babel');

exports.dev = function (args) {
    return builderWebpack3('dev');
};

exports.build = function (args) {
    // console.log(args);

    let isDevBuild = !!args.s;

    // 编译 client src
    builderWebpack3.getWebpackConfig()
        .then((webpackConfig) => {
            // console.log('webpackConfig', webpackConfig);

            let configParams = webpackConfig._configParams;

            builderWebpack3.runBuild(webpackConfig, () => {
                let prependCodePromiseList = [];
                let evalList = [];

                // 如果是非简单模式下，则为打包之后的文件手动增加 nightmare client script
                if (!isDevBuild) {
                    prependCodePromiseList.push(getNightmareClientCode());
                }

                // 插入 jQuery
                prependCodePromiseList.push(getJqueryCode('jQueryCode'));
                evalList.push('jQueryCode');

                // 获得所有的代码之后，追加在头部
                if (prependCodePromiseList.length) {
                    Promise.all(prependCodePromiseList)
                        .then((result) => {
                            result.push(`window.evalList=[${evalList.map(item => `"${item}"`).join(',')}]`);

                            if (isDevBuild) {
                                result.push(`
                                    if (window.evalList && window.evalList.length) {
                                        window.evalList.forEach((item) => {
                                            eval(window[item]);
                                        });
                                    }
                                `);
                            }

                            prependCodeToDistFile(configParams.distClientPath, result.join(';'));
                        });
                }

                // 保存一份配置到本地
                saveWebpackConfig(configParams.distPath, webpackConfig);

                // 这里要延时一点处理，避免 webpack 出错
                setTimeout(() => {
                    // 编译 src
                    builderBabel.getBabelConfig()
                        .then((babelConfig) => {
                            // console.log('babelConfig', babelConfig)
                            builderBabel.runBuild(babelConfig.srcPath, babelConfig.distPath, { debug: false });
                        });
                }, 1000);
            });
        })
        .catch((err) => {
            throw err;
        });
};

function getNightmareClientCode() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, './builder-webpack3/nightmare-preload.js'), 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}

function getJqueryCode(key) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../../../node_modules/jquery/dist/jquery.min.js'), 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            // 必须通过定义变量的方式插入，后续再执行
            resolve(getRawCodeToPrepend(key, data));
        });
    });
}

function prependCodeToDistFile(distClientPath, code) {
    let globResult = glob.sync(path.resolve(distClientPath, './**/**.js'));

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
}

function getRawCodeToPrepend(key, source) {
    let rawCode = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    return `window.${key}=${rawCode};`;
}

function saveWebpackConfig(basePath, data) {
    // 必须要保证这个目录存在，否则构建时可能报错
    fse.ensureDirSync(basePath);

    fse.writeJsonSync(path.join(basePath, './webpack-config.json'), data);
}