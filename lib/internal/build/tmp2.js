const path = require('path');
const config = require('./lib/config');

let configPath = path.resolve(__dirname, '../../../demo');
console.log(configPath);

console.log(config.getConfig(configPath));