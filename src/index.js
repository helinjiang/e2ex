const pkg = require('../package.json');

console.log(pkg);

module.exports = {
    version: pkg.version
};