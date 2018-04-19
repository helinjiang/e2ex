'use strict';

const fs = require('hexo-fs');
const inquirer = require('inquirer');
const Promise = require('bluebird');
const utils = require('../utils');

/**
 * Init e2ex client, including ~/.e2ex, ~/.e2ex/package.json, ~/.e2ex/.e2exrc.yml
 */
class Client {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  initHome() {
    const ctx = this.ctx;
    const {baseDir, log} = ctx;

    return new Promise(function (resolve) {
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isFile()) {
        fs.unlinkSync(baseDir);
      }

      if (!fs.existsSync(baseDir)) {
        log.info('检测到这是您第一次使用e2ex，即将进行cli client初始化');

        fs.mkdirsSync(baseDir);
      }

      log.debug('.e2ex 目录已经创建');
      resolve(ctx);
    });
  }

  initPkg() {
    const ctx = this.ctx;
    const {pkgPath, log} = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(pkgPath)) {
        fs.writeFileSync(pkgPath, JSON.stringify({
          "name": "e2ex-home",
          "version": "0.0.0",
          "private": true
        }, null, 4));
      }

      log.debug('.e2ex/package.json 文件已经创建');
      resolve(ctx);
    });
  }

  initLocalRc() {
    const ctx = this.ctx;
    const {rcPath, config, log} = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(rcPath) || !config || !config.registry) {
        inquirer.prompt([{
          type: 'input',
          name: 'registry',
          message: '请输入npm的registry:',
          default: 'http://registry.npmjs.org'
        }, {
          type: 'input',
          name: 'proxy',
          message: '请输入npm的proxy(默认为空):'
        }]).then((answer) => {
          // Handle user input, trim space
          for (let prop in answer) {
            answer[prop] = answer[prop].trim();
          }
          // Save user config to local file system
          utils.safeDump(answer, rcPath);
          log.debug('.e2ex/.e2exrc.yml 配置文件已经创建');

          log.info('初始化完成，请输入命令开启 e2ex 的使用之旅。(帮助：e2ex -h)');
          process.exit(2);
          resolve(ctx);
        });
      } else {
        log.debug('.e2ex/.e2exrc.yml 配置文件已经创建');
        resolve(ctx);
      }
    });
  }

  initLogs() {
    const ctx = this.ctx;
    const {logDir, log} = ctx;
    return new Promise(function (resolve) {
      if (!fs.existsSync(logDir)) {
        fs.mkdirsSync(logDir);
      }
      log.debug('.e2ex/logs 日志文件夹已经创建');
      resolve(ctx);
    });
  }
}


module.exports = function (ctx) {
  const client = new Client(ctx);

  return Promise.all([
    client.initHome(),
    client.initPkg(),
    // client.initLocalRc(),
    client.initLogs()
  ]);
};
