module.exports = function (source, inputSourceMap) {
    // console.log('\n=======================');

    this.cacheable && this.cacheable();

    let callback = this.async();

    source = 'var a="helinjiang";' + source;

    callback(null, source);
};