import {NightmarePlus} from 'nightmare-handler';

/**
 *
 * @param {String} pageUrl 页面的 URL 地址
 * @param {String} preloadClientScriptPath 运行在客户端的脚本地址，需要是绝对路径
 * @param {Object} [matmanQuery] 如果与 matman 服务器通信，则必须要传递
 * @param {Object} [opts] 额外参数
 * @param {String} [opts.proxyServer] 代理服务器
 * @param {Object} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
 * @param {Boolean} [opts.show] 是否展示调试页面

 */
export default function getResult(pageUrl, preloadClientScriptPath, matmanQuery, opts = {}) {
    // pageUrl 必须要存在，否则后续的测试就没有意义了
    if (!pageUrl) {
        return Promise.reject('unknown pageUrl');
    }

    // preloadClientScriptPath 必须要存在，否则后续的测试就没有意义了
    if (!preloadClientScriptPath) {
        return Promise.reject('unknown preloadClientScriptPath');
    }

    // nightmare 初始化参数
    let nightmareConfig = {
        show: opts.show,
        webPreferences: {
            preload: preloadClientScriptPath
        }
    };

    // 设置代理服务器
    if (opts.proxyServer) {
        nightmareConfig.switches = {
            'proxy-server': opts.proxyServer
        };
    }

    // 如果有设置符合要求的 matman 服务设置，则还需要额外处理一下
    if ((typeof matmanQuery === 'object') && (typeof matmanQuery.getQueryString === 'function')) {
        pageUrl = pageUrl + ((pageUrl.indexOf('?') > -1) ? '&' : '?') + matmanQuery.getQueryString();
    }

    // console.log('===nightmareConfig====', nightmareConfig);

    // 创建 nightmare 对象
    let nightmare = NightmarePlus(nightmareConfig);

    let result = nightmare
        .device('mobile')
        .header('mat-from', 'nightmare')
        .header('mat-timestamp', Date.now())
        .goto(pageUrl);

    // 如果指定了 opts.wait，则会传递给 nightmare 处理，具体使用方法可以参考：
    // https://github.com/segmentio/nightmare#waitms
    if (typeof opts.wait !== 'undefined') {
        result = result.wait(opts.wait);
    }

    // 打开网页获取信息
    return result.evaluate(function () {
        // window.getPageInfo 方法和其他变量均由 preload 配置中的 js 文件引入

        // 如果没有这个变量，说明注入代码失败
        if (!window.e2ex) {
            return {
                error: 'preload failed!'
            };
        }

        // window.getPageInfo 必须是个函数
        if (typeof window.getPageInfo !== 'function') {
            return {
                error: 'window.getPageInfo is not function!'
            };
        }

        // 如果存在需要前端执行的代码，则在所有逻辑开始之前执行
        if (window.evalList && window.evalList.length) {
            window.evalList.forEach((item) => {
                eval(window[item]);
            });
        }

        return window.getPageInfo();
    }).end();
}



