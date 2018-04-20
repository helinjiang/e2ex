module.exports = function (source, inputSourceMap) {
    this.cacheable && this.cacheable();

    let callback = this.async();

    let code = `
        // const jQuery = require('jquery/dist/jquery.min.js');
        // window.jQuery = jQuery;
        // window.$ = jQuery;
        window.e2ex=${Date.now()};
    `;

    callback(null, code + source);
};