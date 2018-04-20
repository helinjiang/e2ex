const utils = require('../../modules/utils');

/**
 * 必须要通过挂载在 window 对象上，才能够被传递到 electronic 中
 * @return {Object}
 */
window.getPageInfo = function () {
    var wrapperDom = document.querySelector('#root');

    return {
        bannerInfo: getBannerInfo(wrapperDom),
        feedsInfo: getFeedsInfo(wrapperDom),
        noticeInfo: getNoticeInfo(wrapperDom)
    };
};

/**
 * 获取模块一：banner
 */
function getBannerInfo(containerDom) {
    var bannerContainerDom = utils.$('.banner-list', containerDom);

    var result = {
        isExist: utils.isExist(bannerContainerDom)
    };

    if (result.isExist) {
        // banner 图片的个数
        result.total = utils.getTotal('.nd-banner-scroller .nd-banner-item', bannerContainerDom);
    }

    return result;
}

/**
 * 获取模块二：feeds
 */
function getFeedsInfo(containerDom) {
    var result = {
        isExist: utils.isExist('.feeds-list', containerDom),
        listCount: utils.getTotal('.feeds-list', containerDom)
    };

    if (result.isExist) {
        // 直播
        var liveInfo = {};
        liveInfo.total = utils.getTotal('.feeds-list .display-feed-card-1 .type.live', containerDom);
        liveInfo.id_8 = getFeedsCard1Info('.id_8');
        liveInfo.id_10086 = getFeedsCard1Info('.id_10086');

        // 录播
        var recordInfo = {};
        recordInfo.total = utils.getTotal('.feeds-list .display-feed-card-1 .type.record', containerDom);
        recordInfo.id_1108610088_11086 = getFeedsCard1Info('.id_1108610088_11086');
        recordInfo.id_999910088_9999 = getFeedsCard1Info('.id_999910088_9999');

        // 录播
        var shortVideoInfo = {};
        shortVideoInfo.total = utils.getTotal('.feeds-list .display-feed-card-2', containerDom);
        shortVideoInfo.id_123 = getFeedsCard2Info('.id_123');
        shortVideoInfo.id_124 = getFeedsCard2Info('.id_124');

        // 加载中文案
        var loadingInfo = {};
        loadingInfo.isExist = utils.isExist('#nomore');
        loadingInfo.wording = utils.getText('#nomore p');

        // 赋值
        result.liveInfo = liveInfo;
        result.recordInfo = recordInfo;
        result.shortVideoInfo = shortVideoInfo;
        result.loadingInfo = loadingInfo;
    }

    return result;
}

/**
 * 获取模块三：notice
 */
function getNoticeInfo(containerDom) {
    var noticeContainerDom = utils.$('.notice-list', containerDom);

    var result = {
        isExist: utils.isExist(noticeContainerDom)
    };

    if (result.isExist) {
        // banner 图片的个数
        result.total = utils.getTotal('.display-feed-card-3', noticeContainerDom);
        result.isExistTitle = utils.isExist('.notice-title', noticeContainerDom);
    }

    return result;
}

/**
 * 获得 .display-feed-card-1 中的数据
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Object}
 */
function getFeedsCard1Info(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = utils.$(`.feeds-list .display-feed-card-1${curDom}`, containerDom);
    }

    if (!curDom) {
        return null;
    }

    var result = {};

    result.anchorName = utils.getText('.name', curDom);
    result.anchorNameStyle = utils.getStyle('.name', curDom);
    result.viewShow = utils.getText('.view', curDom);
    result.roomName = utils.getText('.room-name', curDom);
    result.roomNameStyle = utils.getStyle('.room-name', curDom);
    result.pic = utils.getBackgroundImageUrl('.feeds-card-item', curDom);
    result.anchorPic = utils.getBackgroundImageUrl('.avatar', curDom);
    result.tagPic = utils.getImageDomUrl('.tag img', curDom);
    result.style = utils.getStyle(curDom);
    result.isLive = utils.isExist('.type.live', curDom);
    result.isRecord = utils.isExist('.type.record', curDom);

    return result;
}

/**
 * 获得 .display-feed-card-2 中的数据
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Object}
 */
function getFeedsCard2Info(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = utils.$(`.feeds-list .display-feed-card-2${curDom}`, containerDom);
    }

    if (!curDom) {
        return null;
    }

    var result = {};

    result.name = utils.getText('.name', curDom);
    result.nameStyle = utils.getStyle('.name', curDom);
    result.desc = utils.getText('.desc', curDom);
    result.descStyle = utils.getStyle('.desc', curDom);
    result.pic = utils.getBackgroundImageUrl('.lazyload-pic', curDom);
    result.style = utils.getStyle(curDom);
    result.isSvc = utils.isExist('.type.activity', curDom);

    return result;
}