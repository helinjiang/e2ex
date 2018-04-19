'use strict';

const E2ex = require('./core');
const pkg = require('../package.json');
const figlet = require('figlet');
const chalk = require('chalk');
const minimist = require('minimist');
const semver = require('semver');

/**
 * Entrance file, parse user input and call a command.
 *
 * @param args
 * @returns {Promise.<T>}
 */
function entry(args) {
    args = minimist(process.argv.slice(2));

    const e2ex = new E2ex(args);
    const log = e2ex.log;

    function handleError(err) {
        if (err) {
            log.fatal(err);
        }

        process.exit(2);
    }

    /**
     * Print banner
     * Font preview：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=e2ex%0A
     *
     */
    function printBanner() {
        figlet.text('e2ex', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function (err, data) {
            if (err) {
                log.info('Something went wrong...');
                log.error(err);
                return;
            }

            console.log(chalk.cyan(data));
            console.log(chalk.cyan(` Matman，当前版本v${e2ex.version}, 让数据模拟和测试更简单，主页: https://github.com/helinjiang/e2ex-cli `));
            console.log(chalk.cyan(' (c) powered by IVWEB Team                                                                            '));
            console.log(chalk.cyan(' Run e2ex --help to see usage.                                                                      '));
        });
    }

    log.debug('process.version', process.version);
    log.debug('pkg.engines.node', pkg.engines.node);

    if (!semver.satisfies(process.version, pkg.engines.node)) {
        return log.error(`运行 e2ex 所需Node.js版本为${pkg.engines.node}，当前版本为${process.version}，请升级到最新版本Node.js(https://nodejs.org/en/).`);
    }

    return e2ex.init().then(function () {
        let cmd = '';

        if (args.v || args.version) {
            console.log(`v${e2ex.version}`);
            return;
        } else if (!args.h && !args.help) {
            cmd = args._.shift();

            if (cmd) {
                let c = e2ex.cmd.get(cmd);
                if (!c) cmd = 'help';
            } else {
                printBanner();
                return;
            }
        } else {
            cmd = 'help';
        }

        return e2ex.call(cmd, args).then(function () {

        }).catch(function (err) {
            console.log(err);
        });
    }).catch(handleError);
}

module.exports = entry;