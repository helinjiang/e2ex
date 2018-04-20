'use strict';

exports.__esModule = true;
exports.basicHandle = exports.pageScanDev = exports.dataListNotice = exports.dataComic = undefined;
exports.getScript = getScript;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _comic = require('./data-master/comic');

var _dataComic = _interopRequireWildcard(_comic);

var _listNotice = require('./data-master/list-notice');

var _dataListNotice = _interopRequireWildcard(_listNotice);

var _pageScanDev2 = require('./nightmare-master/page-scan-dev');

var _pageScanDev3 = _interopRequireDefault(_pageScanDev2);

var _basicHandle2 = require('./nightmare-master/basic-handle');

var _basicHandle3 = _interopRequireDefault(_basicHandle2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dataComic = _dataComic;
exports.dataListNotice = _dataListNotice;
exports.pageScanDev = _pageScanDev3.default;
exports.basicHandle = _basicHandle3.default;
function getScript(name) {
    var webpackConfig = require('./webpack-config');

    return _path2.default.join(webpackConfig.output.path, webpackConfig.output.filename.replace(/\[name\]/, name));
}