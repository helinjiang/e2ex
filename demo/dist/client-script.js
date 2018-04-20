'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO 可以将这一块自动打包的代码封装到组件里面，类似 webpack-builder3 的设计思想

var path = require('path');
var glob = require('glob');

/**
 * 编译之前的源码目录
 * @type {String}
 */
var SRC_PATH = './src-client-script';

/**
 * 各个 entry 的路径，该路径下的js会被自动打包出去
 * @type {String}
 */
var SRC_ENTRY_PATH = path.join(SRC_PATH, 'output');

/**
 * 编译之后的目录
 * @type {String}
 */
var OUTPUT_PATH = './dist-client-script';

/**
 * 获得 entry 的配置
 * @return {Object}
 */
function getEntry() {
    var entry = {};
    var dist = {};

    var globResult = glob.sync(path.resolve(__dirname, '../', SRC_ENTRY_PATH, './**/**.js'));

    globResult.forEach(function (item) {
        // const matchResult = item.match(/\/output\/(.*)\.js/);
        var matchResult = item.match(new RegExp('/' + SRC_ENTRY_PATH.replace(/\\/gi, '/') + '/(.*)\\.js'), 'gi');

        var entryName = matchResult && matchResult[1];
        if (entryName) {
            entry[entryName] = item;
            dist[entryName] = item.replace(new RegExp('/' + SRC_ENTRY_PATH.replace(/\\/gi, '/') + '/', 'gi'), '/' + path.basename(OUTPUT_PATH) + '/');
        }
    });

    return entry;
}

/**
 * 加载某个客户端js
 * @param name
 * @return {String}
 */
function load(name) {
    var entry = getEntry();

    var targetEntryName = (0, _keys2.default)(entry).filter(function (entryName) {
        return entryName === name;
    })[0];

    return targetEntryName && entry[targetEntryName].replace(new RegExp('/' + SRC_ENTRY_PATH.replace(/\\/gi, '/') + '/', 'gi'), '/' + path.basename(OUTPUT_PATH) + '/');
}

// console.log('=getEntry()=', getEntry());
// console.log('=load()=', load('comic/get-page-info'));

module.exports = {
    SRC_PATH: SRC_PATH,
    SRC_ENTRY_PATH: SRC_ENTRY_PATH,
    OUTPUT_PATH: OUTPUT_PATH,
    entry: getEntry(),
    load: load
};