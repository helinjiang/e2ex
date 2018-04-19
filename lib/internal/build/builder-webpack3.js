const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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

        // 传递给 webpack entry 参数
        this.webpackEntry = {};

        // 打包之后的信息，其中key值为 entry 的名字，value为打包之后的绝对值路径
        this.outputInfo = {};

        this.init();
    }

    init() {
        let entry = {};
        let dist = {};

        let entryPath = this.entryPath.replace(/\\/gi, '/');
        let distPath = this.distPath.replace(/\\/gi, '/');

        let globResult = glob.sync(path.resolve(this.entryPath, './**/**.js'));

        globResult.forEach((item) => {
            item = item.replace(/\\/gi, '/');

            const matchResult = item.match(new RegExp(entryPath + '/(.*)\\.js'), 'gi');

            const entryName = matchResult && matchResult[1];
            if (entryName) {
                entry[entryName] = item;
                dist[entryName] = item.replace(new RegExp(entryPath, 'gi'), distPath);
            }
        });

        this.webpackEntry = entry;
        this.outputInfo = dist;
    }

    getWebpackConfig() {
        return {
            entry: Object.assign({}, this.webpackEntry),
            output: {
                filename: '[name].js',
                path: this.distPath
            },
            plugins: [
                new CleanWebpackPlugin([this.distPath])
            ]
        };
    }
}

module.exports = BuilderWebpack3;
