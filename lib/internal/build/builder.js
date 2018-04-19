'use strict';

const builderWebpack3 = require('./lib');

exports.dev = function (args) {
    return builderWebpack3('dev');
};

exports.build = function (args) {
    return builderWebpack3('build');
};
