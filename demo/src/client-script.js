// TODO 可以将这一块自动打包的代码封装到组件里面，类似 webpack-builder3 的设计思想

const path = require('path');
const glob = require('glob');

/**
 * 编译之前的源码目录
 * @type {String}
 */
const SRC_PATH = './src-client-script';

/**
 * 各个 entry 的路径，该路径下的js会被自动打包出去
 * @type {String}
 */
const SRC_ENTRY_PATH = path.join(SRC_PATH, 'output');

/**
 * 编译之后的目录
 * @type {String}
 */
const OUTPUT_PATH = './dist-client-script';

/**
 * 获得 entry 的配置
 * @return {Object}
 */
function getEntry() {
    let entry = {};
    let dist = {};

    let globResult = glob.sync(path.resolve(__dirname, '../', SRC_ENTRY_PATH, './**/**.js'));

    globResult.forEach((item) => {
        // const matchResult = item.match(/\/output\/(.*)\.js/);
        const matchResult = item.match(new RegExp('/' + SRC_ENTRY_PATH.replace(/\\/gi, '/') + '/(.*)\\.js'), 'gi');

        const entryName = matchResult && matchResult[1];
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
    let entry = getEntry();

    let targetEntryName = Object.keys(entry).filter((entryName) => {
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