Missing Stylus Plugin for Inlined Images
----------------------------------------

1. Why inline images
It's usefull for cases with big amount of small pictures existing on a web page. When they are inlined in CSS file, there is no
unnecessary network connections. Inlining is very common case for SVG handling, because there is no such thing as "SVG sprite".

2. Why inline SVG in encoded format
Stylus has inlining feature (https://learnboost.github.io/stylus/docs/functions.url.html). Unfortunately, it use base64 encoding only.
Just two words: it's redundant. SVG should be encoded in URL format. Please read more on http://codepen.io/Tigt/post/optimizing-svgs-in-data-uris.

3. Why use Stylus plugin instead of Postcss
You could use Postcss plugins in order to inline SVG (check out https://github.com/Pavliko/postcss-svg). But there is a small inconvenience here. In fact, you wouldn't use standart `url()` syntax, but `svg()` instead, for svg backgrounds. This module offer you use `url()` or `inline-image()` or something else you like, for all types of inlined images. Also, I truly believe, there is no sense to include such things like `svg()` into CSS standart (W3C), so we shouldn't polyfill it through Postcss.

4. Why use Stylus plugin instead of Webpack loaders
Forst of all, there is Stylus loader for Webpack https://github.com/shama/stylus-loader. In Webpack we have standart loader that are dealing with images inlining (https://github.com/webpack/url-loader).
So far we have even SVG webpack loader https://github.com/bhovhannes/svg-url-loader.
But it will change all the files turning it into inline ones. We could set files weight as a constraint, but I prefer agile universal solutions, when a developer has a chance to decide about inlining by himself.


# Webpack Config Example

```js
  module: {
    loaders: [ {
      name: 'styl',
      test: /\.styl$/,
      include: __dirname + '/builds/',
      loader: ExtractTextPlugin.extract(
        'style-loader',
        'css-loader!postcss-loader!stylus-loader'),
    }, {
      name: 'pics',
      test: /\.(jpeg|png|svg)$/,
      include: __dirname + '/builds/',
      loaders: [ 'file?name=[name].[ext]' ],
    } ]
  },
  stylus: {
    define: {
      'inline-image': require('stylus-inline-webpack')({
        limit: 50000
      })
    }
  },
```
# Known Issues
* There is no automatic rebuild in Webpack when developer changes background image source. Just don't use inline syntax in development, set it at the end of work.
