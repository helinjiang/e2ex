const app = require('./demo');

function getResult(opts) {
    // 如何校验，前端页面执行脚本
    let preloadClientScriptPath = app.getScript('comic/get-page-info');

    // 页面环境准备：基础环境
    let config = app.dataComic.successBasic();

    return app.pageScanDev(config.pageUrl, preloadClientScriptPath, config.matmanQuery, Object.assign({}, config.opts, opts));
}


getResult({show:true})
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);

    });

