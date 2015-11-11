var
  fs = require('fs'),
  extname = require('path').extname,
  parse = require('url').parse,
  stylus = require('stylus');

module.exports = function(options) {
  var
    stylusUrlFn = stylus.url.apply(this, arguments),
    sizeLimit = options.limit || 30000;

  function inlineImg(url) {
    var
      localUrl = url,
      compiler = new stylus.Compiler(localUrl);

    compiler.isURL = true;
    localUrl = localUrl.nodes
      .map(function(node) {
        return compiler.visit(node);
      })
      .join('');

    localUrl = parse(localUrl);

    // Not supported
    if (extname(localUrl.href) !== '.svg')
      return stylusUrlFn.apply(this, arguments);

    var literal = new stylus.nodes.Literal('url("' + localUrl.href + '")')

    // Absolute
    if (localUrl.protocol)
      return literal;

    options.paths = (options.paths || []).concat(this.paths);
    var found = stylus.utils.lookup(localUrl.pathname, options.paths);

    if (!found)
      return literal;

    var fileContent = fs.readFileSync(found);

    // Too large
    if (sizeLimit && fileContent.length > sizeLimit)
      return literal;

    fileContent = fileContent.toString('utf8')
      .replace(/<\?xml(.+?)\?>/, '')
      .replace(/"/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/[{}\|\\\^~\[\]`"<>#%]/g, function(match) {
        return '%' + match[0].charCodeAt(0).toString(16).toUpperCase();
      });

    return new stylus.nodes.Literal('url("data:image/svg+xml;charset=utf8,' + fileContent + '")');
  }

  inlineImg.raw = true;
  return inlineImg;
};
