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
const { deepCopy, listDir, merge, isEmpty } = require('./util');
const Config = require('./config');
const projectRoot = Config.getPath();

// 最基础的配置
const baseConfig = {
    entry: glob.sync(path.join(projectRoot, './src/pages/**/init.js')),
    module: {
        rules: []
    },
    plugins: [],
    resolve: {
        alias: glob.sync(path.join(projectRoot, './src/*/')) // 支持Webpack import绝度路径的写法
    }
};

class Builder {

    /**
     * @function createProdConfig
     * @desc     创建用于生产环境中的webpack打包配置
     *
     * @param {Object}  options                         参数
     * @param {Boolean} options.minifyHTML              是否压缩HTML
     * @param {Boolean} options.minifyCSS               是否压缩CSS
     * @param {Boolean} options.minifyJS                是否压缩JS
     * @param {Boolean} options.usePx2rem               是否启用px2rem
     * @param {Number}  options.remUnit                 px2rem的单位, 默认75
     * @param {Number}  options.remPrecision            px2rem的精度，默认8
     * @param {String}  options.moduleName              模块名称
     * @param {String}  options.bizName                 业务名称
     * @param {String}  options.inject                  是否注入chunks
     * @example
     */
    static createProdConfig(options) {
        const prodConfig = deepCopy(baseConfig);

        // 设置打包规则
        const prodRules = [];

        // 设置JS解析规则
        prodRules.push(Builder._setJsRule());

        // 设置打包插件
        let prodPlugins = [];
        // 清空Public目录插件, https://github.com/johnagan/clean-webpack-plugin/issues/17
        prodPlugins.push(new CleanWebpackPlugin(['public'], {
            root: projectRoot,
            verbose: true,
            dry: false
        }));

        prodPlugins.push(new StringReplaceWebpackPlugin());

        if (options.minifyJS) {
            // 压缩JS
            prodPlugins.push(new webpack.optimize.UglifyJsPlugin());
        }

        // 设置NODE_ENV 为 production
        prodPlugins.push(Builder._setDefinePlugin('production'));

        // 多实例构建
        prodPlugins.push(Builder._setHappyPack(options.jsLoader));

        // prodConfig.entry = newEntry;
        // prodConfig.output = Builder._setOutput(true, assetsPrefix, cdnUrl + '/');
        prodConfig.module.rules = prodRules;
        prodConfig.plugins = prodPlugins;
        prodConfig.resolve.alias = Builder._setAlias(options.alias);

        return prodConfig;
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
            presets: ['es2015', 'stage-0', 'react']
        }, jsLoader);

        return new HappyPack({
            loaders: [
                {
                    loader: 'babel-loader',
                    options
                }
            ]
        });
    }

    /**
     * 设置打包后的输出 output 内容
     * @param useHash               是否开启JS资源hash
     * @param pathPrefix            JS的前缀, 不传入则为空
     * @param publicPath
     * @returns {{filename: string, path: string, publicPath: *}}
     * @private
     */
    static _setOutput(useHash, pathPrefix, publicPath) {
        let filename = '';
        let hash = '';

        if (pathPrefix) {
            filename = pathPrefix + '/';
        }

        if (useHash) {
            hash = '_[chunkhash:8]';
        }

        return {
            filename: `${filename}[name]${hash}.js?_bid=152`,
            path: path.join(projectRoot, 'public/'),
            publicPath: publicPath,
            crossOriginLoading: 'anonymous'
        };
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

    /**
     * 设置dev server，WDS配置
     * @param port
     * @returns {{contentBase: string, inline: boolean, historyApiFallback: boolean, disableHostCheck: boolean, port: *}}
     * @private
     */
    static _setDevServer(port) {
        return {
            contentBase: path.join(projectRoot, './src'),
            inline: true,
            historyApiFallback: false,
            disableHostCheck: true,
            port: port
        };
    }

    /**
     * 设置引用的Alias路径匹配规则，以src下面的目录为根目录
     * 支持import TitleBar from "/modules/components/titlebar" 绝对路径语法
     * @param  alias 用户自定义的alias
     *
     * @private
     */
    static _setAlias(alias) {
        const aliasObject = {};

        listDir(path.join(projectRoot, './src'), 1).forEach((dir) => {
            const { name, dirPath } = dir;

            aliasObject['/' + name] = dirPath;
            aliasObject[name] = dirPath;
        });

        if (isEmpty(alias)) {
            return aliasObject;
        }

        return merge(alias, aliasObject);
    }
}

module.exports = Builder;