module.exports = function (source, inputSourceMap) {

    console.log('\n=======================');

    // console.log('\n=======================',source)
    // console.log('=======================',inputSourceMap)

    this.cacheable && this.cacheable();

    let callback = this.async();

    source = 'var a="helinjiang";' + source;

    callback(null, source);
};