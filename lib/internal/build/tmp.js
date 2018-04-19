// const clientScriptEntryConfig = require('./client-script');
//
// console.log(clientScriptEntryConfig)
const path = require('path');
const BuilderWebpack3 = require('./builder-webpack3');

const glob = require('glob');

const BASE_PATH = path.resolve('/', 'gitprojects/now-app-category/e2e-app/app');
console.log(BASE_PATH);

let bw = new BuilderWebpack3(path.join(BASE_PATH, './src-client-script'), path.join(BASE_PATH, './dist-client-script'), {
    entryRelativePath: './output'
});

console.log(bw);
console.log(bw.getWebpackConfig());
//
// let entryPath = 'D:/gitprojects/now-app-category/e2e-app/app/src-client-script/output';
// let distPath = 'D:/gitprojects/now-app-category/e2e-app/app/dist-client-script';
// let target = path.join(entryPath, './**/**.js');
// let globResult = glob.sync(target);
// console.log(target, globResult);
// let SRC_ENTRY_PATH = entryPath.replace(/\\/gi, '/');
// console.log(SRC_ENTRY_PATH);
//
// globResult.forEach((item) => {
//     console.log('\n--', item);
//     item = item.replace(/\\/gi, '/');
//
//     // let SRC_ENTRY_PATH = path.join('./src-client-script', 'output');
//     // const matchResult = item.match(/\/output\/(.*)\.js/);
//     const matchResult = item.match(new RegExp(SRC_ENTRY_PATH + '/(.*)\\.js'), 'gi');
//     console.log('--matchResult', matchResult);
//
//     const entryName = matchResult && matchResult[1];
//     if (entryName) {
//         let distName = item.replace(new RegExp(SRC_ENTRY_PATH, 'gi'), distPath);
//         console.log(distName);
//     }
// });