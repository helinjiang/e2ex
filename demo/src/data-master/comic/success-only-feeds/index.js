/**
 * 只有feeds的场景
 */
import { MatmanQuery } from 'matman-tool-e2e';

/**
 * 获取数据源配置
 * @return {Object}
 */
export default function getConfig() {
    // 哪个页面？
    let pageUrl = 'http://now.qq.com/mobile/category/comic.html?now_n_http=1';

    // 控制浏览器行为的一些参数项
    let opts = {};

    // 哪个服务器？
    opts.proxyServer = 'localhost:8080';

    // 什么情况下开始执行页面爬取？
    opts.wait = '#root .feeds';

    // CGI 的数据源有哪些？
    let matmanQuery = new MatmanQuery();
    matmanQuery.addOne('get_comic_list', 'success_only_feeds', false);

    return {
        pageUrl: pageUrl,
        matmanQuery: matmanQuery,
        opts: opts
    };
}
