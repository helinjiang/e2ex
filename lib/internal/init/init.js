'use strict';

const path = require('path');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const Promise = require('bluebird');

const { pkgJson } = require('../../utils/index');

const registryMap = {
  npm: 'http://registry.npmjs.org',
  cnpm: 'http://r.cnpmjs.org',
  tnpm: 'http://r.tnpm.oa.com'
};

/**
 *
 * @param {Object} args
 * @param {String} args.registry registry地址，输入 --registry=xxx
 * @param {String} args.registry registry地址类型，支持 npm/cnpm/tnpm 输入 --from=xxx
 * @param {String} args.e2ex e2ex 的版本号 输入 --e2ex=1.5.0
 */
module.exports = function (args) {
  // node ./bin/e2ex init --from=tnpm
  // console.log(args);

  new Promise((resolve, reject) => {
    // 如果输入了 e2ex 的版本号，则不再在线查找
    if (args.e2ex) {
      return resolve(args.e2ex);
    }

    // 在线获取 e2ex 的版本号
    let registry = args.registry || registryMap[args.from || 'npm'];

    pkgJson('e2ex', 'latest', registry)
      .then(json => {
        resolve(json.version || '1.5.0');
      });
  })
    .then((e2exVersion) => {
      let name = 'e2ex-app';

      let generatorPath = path.resolve(__dirname, '../../generators/' + name);

      yeomanEnv.register(require.resolve(generatorPath), name);

      // 可以通过透传额外参数到 generator 中，然后通过 this.options 就能够取到传递过去的值
      let yeoResult = yeomanEnv.run(name, {
        'skip-install': true,
        'e2exVersion': e2exVersion
      }, err => {
        // console.log('=====end===', err);
        // 这里的 yeoResult 即 generator 的 this 对象，例如可以通过 result.destinationPath() 获得生成的地址
      });
    });

  return Promise.resolve();
};
