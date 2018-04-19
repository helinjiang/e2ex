// TODO 可以将这一块自动打包的代码封装到组件里面，类似 webpack-builder3 的设计思想

const path = require('path');
const glob = require('glob');

class BuilderWebpack3 {
    /**
     *
     * @param {String} srcPath 编译之前的源码根目录 './src-client-script'
     * @param {String} distPath 编译之后的目录 './dist-client-script'
     * @param {Object} opts 额外参数
     */
    constructor(srcPath, distPath, opts = {}) {
        this.srcPath = srcPath;
        this.distPath = distPath;

        // 各个 entry 的相对路径，该路径下的js会被自动打包出去
        this.entryRelativePath = opts.entryRelativePath || './output';
        this.entryPath = path.join(srcPath, this.entryRelativePath);
    }

    /**
     * 获得 entry 的配置
     * @return {Object}
     */
    getEntry() {
        let entry = {};
        let dist = {};

        let globResult = glob.sync(path.resolve(this.entryPath, './**/**.js'));

        globResult.forEach((item) => {
            console.log('\n--', item);
            // const matchResult = item.match(/\/output\/(.*)\.js/);
            const matchResult = item.match(new RegExp('/' + this.entryPath.replace(/\\/gi, '/') + '/(.*)\\.js'), 'gi');
            console.log('--matchResult', matchResult);

            const entryName = matchResult && matchResult[1];
            if (entryName) {
                entry[entryName] = item;
                dist[entryName] = item.replace(new RegExp('/' + this.entryPath.replace(/\\/gi, '/') + '/', 'gi'), '/' + path.basename(this.distPath) + '/');
            }
        });

        return entry;
    }
}

module.exports = BuilderWebpack3;
//
// /**
//  * 加载某个客户端js
//  * @param name
//  * @return {String}
//  */
// function load(name) {
//     let entry = getEntry();
//
//     let targetEntryName = Object.keys(entry).filter((entryName) => {
//         return entryName === name;
//     })[0];
//
//     return targetEntryName && entry[targetEntryName].replace(new RegExp('/' + SRC_ENTRY_PATH.replace(/\\/gi, '/') + '/', 'gi'), '/' + path.basename(OUTPUT_PATH) + '/');
// }

// console.log('=getEntry()=', getEntry());
// console.log('=load()=', load('comic/get-page-info'));

// module.exports = {
//     SRC_PATH: SRC_PATH,
//     SRC_ENTRY_PATH: SRC_ENTRY_PATH,
//     OUTPUT_PATH: OUTPUT_PATH,
//     entry: getEntry(),
//     load: load
// };