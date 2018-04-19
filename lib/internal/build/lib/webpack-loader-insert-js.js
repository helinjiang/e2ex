module.exports = function (source, inputSourceMap) {
    this.cacheable && this.cacheable();

    let callback = this.async();

    let code = `
        const jQuery = require('jquery/dist/jquery.min.js');
        window.jQuery = jQuery;
        window.$ = jQuery;
    `;

    callback(null, code + source);
};