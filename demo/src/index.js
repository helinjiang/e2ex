import path from 'path';

export * as dataComic from './data-master/comic';
export * as dataListNotice from './data-master/list-notice';

export pageScanDev from './nightmare-master/page-scan-dev';
export basicHandle from './nightmare-master/basic-handle';

export function getScript() {
    let webpackConfig = require('./webpack-config');

    return path.join(webpackConfig.output.path, webpackConfig.output.filename.replace(/\[name\]/, name));
}

