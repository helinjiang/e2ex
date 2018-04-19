const path = require('path');

module.exports = {
    name: 'e2ex',
    srcPath: path.join(__dirname, 'src-client-script'),
    distPath: path.join(__dirname, 'dist-client-script'),
    entryRelativePath: './output',
    minifyJS: true
};