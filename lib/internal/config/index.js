'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('config', 'Get, set or list .e2exrc.yml config items.', {}, require('./config'));
};
