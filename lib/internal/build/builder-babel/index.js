const babelD = require('babel-d');
const utils = require('../utils');

/**
 *
 * @return {Promise}
 */
function getBabelConfig() {
    return utils.getConfig();
}

function runBuild(srcPath, distPath, options = {}) {
    if (options.debug) {
        console.log('\nBegin build...', srcPath, distPath, options);
    }

    //===============================================================
    // 5. 把所有的文件都 babel 转义
    //===============================================================
    babelD(srcPath, distPath, { debug: options.debug });

    if (options.debug) {
        console.log('Build end!\n');
    }

}

module.exports = {
    getBabelConfig: getBabelConfig,
    runBuild: runBuild
};