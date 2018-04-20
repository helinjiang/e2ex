'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = getResult;

var _nightmareHandler = require('nightmare-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {String} pageUrl 页面的 URL 地址
 * @param {String} preloadClientScriptPath 运行在客户端的脚本地址，需要是绝对路径
 * @param {Object} [matmanQuery] 如果与 matman 服务器通信，则必须要传递
 * @param {Object} [opts] 额外参数
 * @param {Boolean} [opts.show] 是否需要展示调试的webview窗口
 * @param {String} [opts.proxyServer] 代理服务器
 * @param {Object} [opts.wait] wait配置，会直接透传给 nightmare 的 wait 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
 * @param {Function} [opts.runBefore] 加载页面之前要执行的方法
 * @param {Function} [opts.runAfter] 加载页面之后要执行的方法
 */
function getResult(pageUrl, preloadClientScriptPath, matmanQuery) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    // pageUrl 必须要存在，否则后续的测试就没有意义了
    if (!pageUrl) {
        return _promise2.default.reject('unknown pageUrl');
    }

    // preloadClientScriptPath 必须要存在，否则后续的测试就没有意义了
    if (!preloadClientScriptPath) {
        return _promise2.default.reject('unknown preloadClientScriptPath');
    }

    // nightmare 初始化参数
    var nightmareConfig = {
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
    if ((typeof matmanQuery === 'undefined' ? 'undefined' : (0, _typeof3.default)(matmanQuery)) === 'object' && typeof matmanQuery.getQueryString === 'function') {
        pageUrl = pageUrl + (pageUrl.indexOf('?') > -1 ? '&' : '?') + matmanQuery.getQueryString();
    }

    // console.log('===nightmareConfig====', nightmareConfig);

    // 创建 nightmare 对象
    var nightmare = (0, _nightmareHandler.NightmarePlus)(nightmareConfig);

    var globalInfo = {};

    /**
     * 初始化
     */
    if (typeof opts.init === 'function') {
        globalInfo = opts.init(nightmare);
    }

    var nightmareRunResult = nightmare.device('mobile').header('mat-from', 'nightmare').header('mat-timestamp', Date.now());

    /**
     * 加载页面之前要执行的方法
     */
    if (typeof opts.runBefore === 'function') {
        nightmareRunResult = opts.runBefore(nightmareRunResult);
    }

    nightmareRunResult = nightmareRunResult.goto(pageUrl);

    // 如果指定了 opts.wait，则会传递给 nightmare 处理，具体使用方法可以参考：
    // https://github.com/segmentio/nightmare#waitms
    if (typeof opts.wait !== 'undefined') {
        nightmareRunResult = nightmareRunResult.wait(opts.wait);
    }

    /**
     * 加载页面之后要执行的方法
     */
    if (typeof opts.runAfter === 'function') {
        nightmareRunResult = opts.runAfter(nightmareRunResult);
    }

    // 打开网页获取信息
    return nightmareRunResult.evaluate(function () {
        // window.getPageInfo 方法由 preload 配置中的 js 文件引入
        return window.getPageInfo();
    }).end().then(function (data) {
        return _promise2.default.resolve({
            data: data,
            globalInfo: globalInfo
        });
    });
} /**
   * 通用的流程
   */