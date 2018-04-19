'use strict';

/**
 * Copyright (c) 2018 Tencent Inc.
 *
 * Webpack构建器，适用于NOW直播IVWEB团队工程项目.
 *
 * cpselvis <cpselvis@gmal.com>
 */
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const config = require('./config');
const projectRoot = config.getConfigPath();

// const WebpackLoaderInsertJS = require('./webpack-loader-insert-js');

class Builder {

    /**
     * @function createProdConfig
     * @desc     创建用于生产环境中的webpack打包配置
     *
     * @param {Object}  options
     * @param {Boolean} options.distPath
     * @param {Boolean} options.srcPath
     * @param {Boolean} options.entryRelativePath
     * @param {Boolean} options.jsLoader
     * @param {Number}  options.minifyJS
     * @example
     */
    static createProdConfig(options) {
        const prodConfig = {};

        // 设置打包规则
        const prodRules = [];

        // 设置JS解析规则
        prodRules.push(Builder._setJsRule());

        // 设置打包插件
        let prodPlugins = [];

        // 清空, https://github.com/johnagan/clean-webpack-plugin/issues/17
        prodPlugins.push(new CleanWebpackPlugin([options.distPath], {
            root: projectRoot,
            verbose: true,
            dry: false
        }));

        prodPlugins.push(new StringReplaceWebpackPlugin());

        // if (options.minifyJS) {
        //     // 压缩JS
        //     prodPlugins.push(new webpack.optimize.UglifyJsPlugin());
        // }

        // 设置NODE_ENV 为 production
        prodPlugins.push(Builder._setDefinePlugin('production'));

        // 多实例构建
        prodPlugins.push(Builder._setHappyPack(options.jsLoader));

        prodConfig.entry = Builder._getEntry(path.join(options.srcPath, options.entryRelativePath));
        prodConfig.output = {
            filename: '[name].js',
            path: options.distPath
        };
        // prodConfig.module = {
        //     rules: prodRules
        // };
        prodConfig.plugins = prodPlugins;

        return prodConfig;
    }

    static _getEntry(entryPath) {
        let entry = {};
        // let dist = {};

        entryPath = entryPath.replace(/\\/gi, '/');
        // let distPath = this.distPath.replace(/\\/gi, '/');

        let globResult = glob.sync(path.resolve(entryPath, './**/**.js'));

        globResult.forEach((item) => {
            item = item.replace(/\\/gi, '/');

            const matchResult = item.match(new RegExp(entryPath + '/(.*)\\.js'), 'gi');

            const entryName = matchResult && matchResult[1];
            if (entryName) {
                entry[entryName] = item;
                // dist[entryName] = item.replace(new RegExp(entryPath, 'gi'), distPath);
            }
        });

        return entry;
    }

    static _setHappyPack(jsLoader) {
        let options = Object.assign({
            cacheDirectory: true,
            plugins: [
                'transform-decorators-legacy',
                [
                    'import', {
                    'libraryName': 'antd',
                    'libraryDirectory': 'es',
                    'style': 'css'
                }
                ]
            ],
            presets: ['es2015', 'stage-0']
        }, jsLoader);

        return new HappyPack({
            loaders: [
                {
                    loader: 'babel-loader',
                    options
                },
                {
                    loader: path.join(__dirname, './webpack-loader-insert-js')
                }
            ]
        });
    }

    /**
     * 设置Js文件解析规则, 此处使用happypack,多实例构建
     *
     * @returns {{test: RegExp, loader: string}}
     * @private
     */
    static _setJsRule() {
        return { test: /\.js$/, loader: 'happypack/loader' };
    }

    /**
     * 设置NODE_ENV，否则 线上会报 warning.
     * https://stackoverflow.com/questions/30030031
     */
    static _setDefinePlugin(env) {
        return new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        });
    }
}

module.exports = Builder;