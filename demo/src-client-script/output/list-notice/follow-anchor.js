// overwrite the default confirm
window.confirm = function (message, defaultResponse) {
    console.log('【window.confirm】', message, defaultResponse);

    // 打桩设置值
    let res = !!utils.urlHandle.query('stub_confirm_ok');

    __nightmare.ipc.send('page', 'confirm', message, res);

    // TODO 这里的返回值可以通过请求的URL参数来进行控制
    return res;
};

const utils = require('../../modules/utils');

/**
 * 必须要通过挂载在 window 对象上，才能够被传递到 electronic 中
 * @return {Object}
 */
window.getPageInfo = function () {
    var wrapperDom = document.querySelector('#root');

    return getFeedsInfo(wrapperDom);
};

function getFeedsInfo(containerDom) {
    var result = {
        isExist: utils.isExist('.notice-list', containerDom),
        listCount: utils.getTotal('.notice-list', containerDom),
        itemCount: utils.getTotal('.notice-list .display-feed-card-3', containerDom)
    };

    if (result.isExist) {
        var listGroup = {};

        utils.$$('.notice-list', containerDom).forEach(function (itemDom) {
            var key = utils.getAttr('data-dayid', itemDom);

            var obj = {
                title: utils.getText('.notice-title', itemDom),
                total: utils.getTotal('.display-feed-card-3', itemDom),
                tag: utils.getAttr('data-tag', itemDom),
                id: key
            };

            listGroup[key] = obj;
        });

        var itemInfo = {};
        itemInfo.id_1 = getFeedsCard3Info('.id_1');
        itemInfo.id_2 = getFeedsCard3Info('.id_2');
        itemInfo.id_3 = getFeedsCard3Info('.id_3');
        itemInfo.id_120 = getFeedsCard3Info('.id_120');

        // 赋值
        result.listGroup = listGroup;
        result.itemInfo = itemInfo;
    }

    return result;
}

/**
 * 获得 .display-feed-card-1 中的数据
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Object}
 */
function getFeedsCard3Info(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = utils.$(`.notice-list .display-feed-card-3${curDom}`, containerDom);
    }

    if (!curDom) {
        return null;
    }

    var result = {};

    result.title = utils.getText('.title', curDom);
    result.titleStyle = utils.getStyle('.title', curDom);
    result.desc = utils.getText('.desc', curDom);
    result.isFollowed = utils.isExist('.followed', curDom);

    return result;
}
