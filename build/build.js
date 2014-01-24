
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-query/index.js", Function("exports, require, module",
"function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
  return exports;\n\
};\n\
//@ sourceURL=component-query/index.js"
));
require.register("component-ease/index.js", Function("exports, require, module",
"\n\
// easing functions from \"Tween.js\"\n\
\n\
exports.linear = function(n){\n\
  return n;\n\
};\n\
\n\
exports.inQuad = function(n){\n\
  return n * n;\n\
};\n\
\n\
exports.outQuad = function(n){\n\
  return n * (2 - n);\n\
};\n\
\n\
exports.inOutQuad = function(n){\n\
  n *= 2;\n\
  if (n < 1) return 0.5 * n * n;\n\
  return - 0.5 * (--n * (n - 2) - 1);\n\
};\n\
\n\
exports.inCube = function(n){\n\
  return n * n * n;\n\
};\n\
\n\
exports.outCube = function(n){\n\
  return --n * n * n + 1;\n\
};\n\
\n\
exports.inOutCube = function(n){\n\
  n *= 2;\n\
  if (n < 1) return 0.5 * n * n * n;\n\
  return 0.5 * ((n -= 2 ) * n * n + 2);\n\
};\n\
\n\
exports.inQuart = function(n){\n\
  return n * n * n * n;\n\
};\n\
\n\
exports.outQuart = function(n){\n\
  return 1 - (--n * n * n * n);\n\
};\n\
\n\
exports.inOutQuart = function(n){\n\
  n *= 2;\n\
  if (n < 1) return 0.5 * n * n * n * n;\n\
  return -0.5 * ((n -= 2) * n * n * n - 2);\n\
};\n\
\n\
exports.inQuint = function(n){\n\
  return n * n * n * n * n;\n\
}\n\
\n\
exports.outQuint = function(n){\n\
  return --n * n * n * n * n + 1;\n\
}\n\
\n\
exports.inOutQuint = function(n){\n\
  n *= 2;\n\
  if (n < 1) return 0.5 * n * n * n * n * n;\n\
  return 0.5 * ((n -= 2) * n * n * n * n + 2);\n\
};\n\
\n\
exports.inSine = function(n){\n\
  return 1 - Math.cos(n * Math.PI / 2 );\n\
};\n\
\n\
exports.outSine = function(n){\n\
  return Math.sin(n * Math.PI / 2);\n\
};\n\
\n\
exports.inOutSine = function(n){\n\
  return .5 * (1 - Math.cos(Math.PI * n));\n\
};\n\
\n\
exports.inExpo = function(n){\n\
  return 0 == n ? 0 : Math.pow(1024, n - 1);\n\
};\n\
\n\
exports.outExpo = function(n){\n\
  return 1 == n ? n : 1 - Math.pow(2, -10 * n);\n\
};\n\
\n\
exports.inOutExpo = function(n){\n\
  if (0 == n) return 0;\n\
  if (1 == n) return 1;\n\
  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);\n\
  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);\n\
};\n\
\n\
exports.inCirc = function(n){\n\
  return 1 - Math.sqrt(1 - n * n);\n\
};\n\
\n\
exports.outCirc = function(n){\n\
  return Math.sqrt(1 - (--n * n));\n\
};\n\
\n\
exports.inOutCirc = function(n){\n\
  n *= 2\n\
  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);\n\
  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);\n\
};\n\
\n\
exports.inBack = function(n){\n\
  var s = 1.70158;\n\
  return n * n * (( s + 1 ) * n - s);\n\
};\n\
\n\
exports.outBack = function(n){\n\
  var s = 1.70158;\n\
  return --n * n * ((s + 1) * n + s) + 1;\n\
};\n\
\n\
exports.inOutBack = function(n){\n\
  var s = 1.70158 * 1.525;\n\
  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );\n\
  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );\n\
};\n\
\n\
exports.inBounce = function(n){\n\
  return 1 - exports.outBounce(1 - n);\n\
};\n\
\n\
exports.outBounce = function(n){\n\
  if ( n < ( 1 / 2.75 ) ) {\n\
    return 7.5625 * n * n;\n\
  } else if ( n < ( 2 / 2.75 ) ) {\n\
    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;\n\
  } else if ( n < ( 2.5 / 2.75 ) ) {\n\
    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;\n\
  } else {\n\
    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;\n\
  }\n\
};\n\
\n\
exports.inOutBounce = function(n){\n\
  if (n < .5) return exports.inBounce(n * 2) * .5;\n\
  return exports.outBounce(n * 2 - 1) * .5 + .5;\n\
};\n\
\n\
exports.inElastic = function(n){\n\
  var s, a = 0.1, p = 0.4;\n\
  if ( n === 0 ) return 0;\n\
  if ( n === 1 ) return 1;\n\
  if ( !a || a < 1 ) { a = 1; s = p / 4; }\n\
  else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );\n\
  return - ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) );\n\
};\n\
\n\
exports.outElastic = function(n){\n\
  var s, a = 0.1, p = 0.4;\n\
  if ( n === 0 ) return 0;\n\
  if ( n === 1 ) return 1;\n\
  if ( !a || a < 1 ) { a = 1; s = p / 4; }\n\
  else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );\n\
  return ( a * Math.pow( 2, - 10 * n) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) + 1 );\n\
};\n\
\n\
exports.inOutElastic = function(n){\n\
  var s, a = 0.1, p = 0.4;\n\
  if ( n === 0 ) return 0;\n\
  if ( n === 1 ) return 1;\n\
  if ( !a || a < 1 ) { a = 1; s = p / 4; }\n\
  else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );\n\
  if ( ( n *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) );\n\
  return a * Math.pow( 2, -10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;\n\
};\n\
\n\
// aliases\n\
\n\
exports['in-quad'] = exports.inQuad;\n\
exports['out-quad'] = exports.outQuad;\n\
exports['in-out-quad'] = exports.inOutQuad;\n\
exports['in-cube'] = exports.inCube;\n\
exports['out-cube'] = exports.outCube;\n\
exports['in-out-cube'] = exports.inOutCube;\n\
exports['in-quart'] = exports.inQuart;\n\
exports['out-quart'] = exports.outQuart;\n\
exports['in-out-quart'] = exports.inOutQuart;\n\
exports['in-quint'] = exports.inQuint;\n\
exports['out-quint'] = exports.outQuint;\n\
exports['in-out-quint'] = exports.inOutQuint;\n\
exports['in-sine'] = exports.inSine;\n\
exports['out-sine'] = exports.outSine;\n\
exports['in-out-sine'] = exports.inOutSine;\n\
exports['in-expo'] = exports.inExpo;\n\
exports['out-expo'] = exports.outExpo;\n\
exports['in-out-expo'] = exports.inOutExpo;\n\
exports['in-circ'] = exports.inCirc;\n\
exports['out-circ'] = exports.outCirc;\n\
exports['in-out-circ'] = exports.inOutCirc;\n\
exports['in-back'] = exports.inBack;\n\
exports['out-back'] = exports.outBack;\n\
exports['in-out-back'] = exports.inOutBack;\n\
exports['in-bounce'] = exports.inBounce;\n\
exports['out-bounce'] = exports.outBounce;\n\
exports['in-out-bounce'] = exports.inOutBounce;\n\
exports['in-elastic'] = exports.inElastic;\n\
exports['out-elastic'] = exports.outElastic;\n\
exports['in-out-elastic'] = exports.inOutElastic;\n\
//@ sourceURL=component-ease/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\"\n\
  return new Function('_', 'return _.' + str);\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object Error]': return 'error';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val !== val) return 'nan';\n\
  if (val && val.nodeType === 1) return 'element';\n\
\n\
  return typeof val.valueOf();\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var toFunction = require('to-function');\n\
var type;\n\
\n\
try {\n\
  type = require('type-component');\n\
} catch (e) {\n\
  type = require('type');\n\
}\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  fn = toFunction(fn);\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn);\n\
      return object(obj, fn);\n\
    case 'string':\n\
      return string(obj, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn(key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("visionmedia-debug/index.js", Function("exports, require, module",
"if ('undefined' == typeof window) {\n\
  module.exports = require('./lib/debug');\n\
} else {\n\
  module.exports = require('./debug');\n\
}\n\
//@ sourceURL=visionmedia-debug/index.js"
));
require.register("visionmedia-debug/debug.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
module.exports = debug;\n\
\n\
/**\n\
 * Create a debugger with the given `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
function debug(name) {\n\
  if (!debug.enabled(name)) return function(){};\n\
\n\
  return function(fmt){\n\
    fmt = coerce(fmt);\n\
\n\
    var curr = new Date;\n\
    var ms = curr - (debug[name] || curr);\n\
    debug[name] = curr;\n\
\n\
    fmt = name\n\
      + ' '\n\
      + fmt\n\
      + ' +' + debug.humanize(ms);\n\
\n\
    // This hackery is required for IE8\n\
    // where `console.log` doesn't have 'apply'\n\
    window.console\n\
      && console.log\n\
      && Function.prototype.apply.call(console.log, console, arguments);\n\
  }\n\
}\n\
\n\
/**\n\
 * The currently active debug mode names.\n\
 */\n\
\n\
debug.names = [];\n\
debug.skips = [];\n\
\n\
/**\n\
 * Enables a debug mode by name. This can include modes\n\
 * separated by a colon and wildcards.\n\
 *\n\
 * @param {String} name\n\
 * @api public\n\
 */\n\
\n\
debug.enable = function(name) {\n\
  try {\n\
    localStorage.debug = name;\n\
  } catch(e){}\n\
\n\
  var split = (name || '').split(/[\\s,]+/)\n\
    , len = split.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    name = split[i].replace('*', '.*?');\n\
    if (name[0] === '-') {\n\
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));\n\
    }\n\
    else {\n\
      debug.names.push(new RegExp('^' + name + '$'));\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Disable debug output.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
debug.disable = function(){\n\
  debug.enable('');\n\
};\n\
\n\
/**\n\
 * Humanize the given `ms`.\n\
 *\n\
 * @param {Number} m\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
debug.humanize = function(ms) {\n\
  var sec = 1000\n\
    , min = 60 * 1000\n\
    , hour = 60 * min;\n\
\n\
  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';\n\
  if (ms >= min) return (ms / min).toFixed(1) + 'm';\n\
  if (ms >= sec) return (ms / sec | 0) + 's';\n\
  return ms + 'ms';\n\
};\n\
\n\
/**\n\
 * Returns true if the given mode name is enabled, false otherwise.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
debug.enabled = function(name) {\n\
  for (var i = 0, len = debug.skips.length; i < len; i++) {\n\
    if (debug.skips[i].test(name)) {\n\
      return false;\n\
    }\n\
  }\n\
  for (var i = 0, len = debug.names.length; i < len; i++) {\n\
    if (debug.names[i].test(name)) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
/**\n\
 * Coerce `val`.\n\
 */\n\
\n\
function coerce(val) {\n\
  if (val instanceof Error) return val.stack || val.message;\n\
  return val;\n\
}\n\
\n\
// persist\n\
\n\
try {\n\
  if (window.localStorage) debug.enable(localStorage.debug);\n\
} catch(e){}\n\
//@ sourceURL=visionmedia-debug/debug.js"
));
require.register("ianstormtaylor-to-no-case/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `toNoCase`.\n\
 */\n\
\n\
module.exports = toNoCase;\n\
\n\
\n\
/**\n\
 * Test whether a string is camel-case.\n\
 */\n\
\n\
var hasSpace = /\\s/;\n\
var hasCamel = /[a-z][A-Z]/;\n\
var hasSeparator = /[\\W_]/;\n\
\n\
\n\
/**\n\
 * Remove any starting case from a `string`, like camel or snake, but keep\n\
 * spaces and punctuation that may be important otherwise.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function toNoCase (string) {\n\
  if (hasSpace.test(string)) return string.toLowerCase();\n\
\n\
  if (hasSeparator.test(string)) string = unseparate(string);\n\
  if (hasCamel.test(string)) string = uncamelize(string);\n\
  return string.toLowerCase();\n\
}\n\
\n\
\n\
/**\n\
 * Separator splitter.\n\
 */\n\
\n\
var separatorSplitter = /[\\W_]+(.|$)/g;\n\
\n\
\n\
/**\n\
 * Un-separate a `string`.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function unseparate (string) {\n\
  return string.replace(separatorSplitter, function (m, next) {\n\
    return next ? ' ' + next : '';\n\
  });\n\
}\n\
\n\
\n\
/**\n\
 * Camelcase splitter.\n\
 */\n\
\n\
var camelSplitter = /(.)([A-Z]+)/g;\n\
\n\
\n\
/**\n\
 * Un-camelcase a `string`.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function uncamelize (string) {\n\
  return string.replace(camelSplitter, function (m, previous, uppers) {\n\
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-no-case/index.js"
));
require.register("ianstormtaylor-to-space-case/index.js", Function("exports, require, module",
"\n\
var clean = require('to-no-case');\n\
\n\
\n\
/**\n\
 * Expose `toSpaceCase`.\n\
 */\n\
\n\
module.exports = toSpaceCase;\n\
\n\
\n\
/**\n\
 * Convert a `string` to space case.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
\n\
function toSpaceCase (string) {\n\
  return clean(string).replace(/[\\W_]+(.|$)/g, function (matches, match) {\n\
    return match ? ' ' + match : '';\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-space-case/index.js"
));
require.register("ianstormtaylor-to-camel-case/index.js", Function("exports, require, module",
"\n\
var toSpace = require('to-space-case');\n\
\n\
\n\
/**\n\
 * Expose `toCamelCase`.\n\
 */\n\
\n\
module.exports = toCamelCase;\n\
\n\
\n\
/**\n\
 * Convert a `string` to camel case.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
\n\
function toCamelCase (string) {\n\
  return toSpace(string).replace(/\\s(\\w)/g, function (matches, letter) {\n\
    return letter.toUpperCase();\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-camel-case/index.js"
));
require.register("component-within-document/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Check if `el` is within the document.\n\
 *\n\
 * @param {Element} el\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
module.exports = function(el) {\n\
  var node = el;\n\
  while (node = node.parentNode) {\n\
    if (node == document) return true;\n\
  }\n\
  return false;\n\
};//@ sourceURL=component-within-document/index.js"
));
require.register("component-css/index.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css');\n\
var set = require('./lib/style');\n\
var get = require('./lib/css');\n\
\n\
/**\n\
 * Expose `css`\n\
 */\n\
\n\
module.exports = css;\n\
\n\
/**\n\
 * Get and set css values\n\
 *\n\
 * @param {Element} el\n\
 * @param {String|Object} prop\n\
 * @param {Mixed} val\n\
 * @return {Element} el\n\
 * @api public\n\
 */\n\
\n\
function css(el, prop, val) {\n\
  if (!el) return;\n\
\n\
  if (undefined !== val) {\n\
    var obj = {};\n\
    obj[prop] = val;\n\
    debug('setting styles %j', obj);\n\
    return setStyles(el, obj);\n\
  }\n\
\n\
  if ('object' == typeof prop) {\n\
    debug('setting styles %j', prop);\n\
    return setStyles(el, prop);\n\
  }\n\
\n\
  debug('getting %s', prop);\n\
  return get(el, prop);\n\
}\n\
\n\
/**\n\
 * Set the styles on an element\n\
 *\n\
 * @param {Element} el\n\
 * @param {Object} props\n\
 * @return {Element} el\n\
 */\n\
\n\
function setStyles(el, props) {\n\
  for (var prop in props) {\n\
    set(el, prop, props[prop]);\n\
  }\n\
\n\
  return el;\n\
}\n\
//@ sourceURL=component-css/index.js"
));
require.register("component-css/lib/css.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:css');\n\
var camelcase = require('to-camel-case');\n\
var computed = require('./computed');\n\
var property = require('./prop');\n\
\n\
/**\n\
 * Expose `css`\n\
 */\n\
\n\
module.exports = css;\n\
\n\
/**\n\
 * CSS Normal Transforms\n\
 */\n\
\n\
var cssNormalTransform = {\n\
  letterSpacing: 0,\n\
  fontWeight: 400\n\
};\n\
\n\
/**\n\
 * Get a CSS value\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @param {Array} styles\n\
 * @return {String}\n\
 */\n\
\n\
function css(el, prop, extra, styles) {\n\
  var hooks = require('./hooks');\n\
  var orig = camelcase(prop);\n\
  var style = el.style;\n\
  var val;\n\
\n\
  prop = property(prop, style);\n\
  var hook = hooks[prop] || hooks[orig];\n\
\n\
  // If a hook was provided get the computed value from there\n\
  if (hook && hook.get) {\n\
    debug('get hook provided. use that');\n\
    val = hook.get(el, true, extra);\n\
  }\n\
\n\
  // Otherwise, if a way to get the computed value exists, use that\n\
  if (undefined == val) {\n\
    debug('fetch the computed value of %s', prop);\n\
    val = computed(el, prop);\n\
  }\n\
\n\
  if ('normal' == val && cssNormalTransform[prop]) {\n\
    val = cssNormalTransform[prop];\n\
    debug('normal => %s', val);\n\
  }\n\
\n\
  // Return, converting to number if forced or a qualifier was provided and val looks numeric\n\
  if ('' == extra || extra) {\n\
    debug('converting value: %s into a number');\n\
    var num = parseFloat(val);\n\
    return true === extra || isNumeric(num) ? num || 0 : val;\n\
  }\n\
\n\
  return val;\n\
}\n\
\n\
/**\n\
 * Is Numeric\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Boolean}\n\
 */\n\
\n\
function isNumeric(obj) {\n\
  return !isNan(parseFloat(obj)) && isFinite(obj);\n\
}\n\
//@ sourceURL=component-css/lib/css.js"
));
require.register("component-css/lib/prop.js", Function("exports, require, module",
"/**\n\
 * Module dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:prop');\n\
var camelcase = require('to-camel-case');\n\
var vendor = require('./vendor');\n\
\n\
/**\n\
 * Export `prop`\n\
 */\n\
\n\
module.exports = prop;\n\
\n\
/**\n\
 * Normalize Properties\n\
 */\n\
\n\
var cssProps = {\n\
  'float': 'cssFloat' in document.body.style ? 'cssFloat' : 'styleFloat'\n\
};\n\
\n\
/**\n\
 * Get the vendor prefixed property\n\
 *\n\
 * @param {String} prop\n\
 * @param {String} style\n\
 * @return {String} prop\n\
 * @api private\n\
 */\n\
\n\
function prop(prop, style) {\n\
  prop = cssProps[prop] || (cssProps[prop] = vendor(prop, style));\n\
  debug('transform property: %s => %s');\n\
  return prop;\n\
}\n\
//@ sourceURL=component-css/lib/prop.js"
));
require.register("component-css/lib/swap.js", Function("exports, require, module",
"/**\n\
 * Export `swap`\n\
 */\n\
\n\
module.exports = swap;\n\
\n\
/**\n\
 * Initialize `swap`\n\
 *\n\
 * @param {Element} el\n\
 * @param {Object} options\n\
 * @param {Function} fn\n\
 * @param {Array} args\n\
 * @return {Mixed}\n\
 */\n\
\n\
function swap(el, options, fn, args) {\n\
  // Remember the old values, and insert the new ones\n\
  for (var key in options) {\n\
    old[key] = el.style[key];\n\
    el.style[key] = options[key];\n\
  }\n\
\n\
  ret = fn.apply(el, args || []);\n\
\n\
  // Revert the old values\n\
  for (key in options) {\n\
    el.style[key] = old[key];\n\
  }\n\
\n\
  return ret;\n\
}\n\
//@ sourceURL=component-css/lib/swap.js"
));
require.register("component-css/lib/style.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:style');\n\
var camelcase = require('to-camel-case');\n\
var support = require('./support');\n\
var property = require('./prop');\n\
var hooks = require('./hooks');\n\
\n\
/**\n\
 * Expose `style`\n\
 */\n\
\n\
module.exports = style;\n\
\n\
/**\n\
 * Possibly-unitless properties\n\
 *\n\
 * Don't automatically add 'px' to these properties\n\
 */\n\
\n\
var cssNumber = {\n\
  \"columnCount\": true,\n\
  \"fillOpacity\": true,\n\
  \"fontWeight\": true,\n\
  \"lineHeight\": true,\n\
  \"opacity\": true,\n\
  \"order\": true,\n\
  \"orphans\": true,\n\
  \"widows\": true,\n\
  \"zIndex\": true,\n\
  \"zoom\": true\n\
};\n\
\n\
/**\n\
 * Set a css value\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} val\n\
 * @param {Mixed} extra\n\
 */\n\
\n\
function style(el, prop, val, extra) {\n\
  // Don't set styles on text and comment nodes\n\
  if (!el || el.nodeType === 3 || el.nodeType === 8 || !el.style ) return;\n\
\n\
  var orig = camelcase(prop);\n\
  var style = el.style;\n\
  var type = typeof val;\n\
\n\
  if (!val) return get(el, prop, orig, extra);\n\
\n\
  prop = property(prop, style);\n\
\n\
  var hook = hooks[prop] || hooks[orig];\n\
\n\
  // If a number was passed in, add 'px' to the (except for certain CSS properties)\n\
  if ('number' == type && !cssNumber[orig]) {\n\
    debug('adding \"px\" to end of number');\n\
    val += 'px';\n\
  }\n\
\n\
  // Fixes jQuery #8908, it can be done more correctly by specifying setters in cssHooks,\n\
  // but it would mean to define eight (for every problematic property) identical functions\n\
  if (!support.clearCloneStyle && '' === val && 0 === prop.indexOf('background')) {\n\
    debug('set property (%s) value to \"inherit\"', prop);\n\
    style[prop] = 'inherit';\n\
  }\n\
\n\
  // If a hook was provided, use that value, otherwise just set the specified value\n\
  if (!hook || !hook.set || undefined !== (val = hook.set(el, val, extra))) {\n\
    // Support: Chrome, Safari\n\
    // Setting style to blank string required to delete \"style: x !important;\"\n\
    debug('set hook defined. setting property (%s) to %s', prop, val);\n\
    style[prop] = '';\n\
    style[prop] = val;\n\
  }\n\
\n\
}\n\
\n\
/**\n\
 * Get the style\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {String} orig\n\
 * @param {Mixed} extra\n\
 * @return {String}\n\
 */\n\
\n\
function get(el, prop, orig, extra) {\n\
  var style = el.style;\n\
  var hook = hooks[prop] || hooks[orig];\n\
  var ret;\n\
\n\
  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {\n\
    debug('get hook defined, returning: %s', ret);\n\
    return ret;\n\
  }\n\
\n\
  ret = style[prop];\n\
  debug('getting %s', ret);\n\
  return ret;\n\
}\n\
//@ sourceURL=component-css/lib/style.js"
));
require.register("component-css/lib/hooks.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var each = require('each');\n\
var css = require('./css');\n\
var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };\n\
var pnum = (/[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)/).source;\n\
var rnumnonpx = new RegExp( '^(' + pnum + ')(?!px)[a-z%]+$', 'i');\n\
var rnumsplit = new RegExp( '^(' + pnum + ')(.*)$', 'i');\n\
var rdisplayswap = /^(none|table(?!-c[ea]).+)/;\n\
var styles = require('./styles');\n\
var support = require('./support');\n\
var swap = require('./swap');\n\
var computed = require('./computed');\n\
var cssExpand = [ \"Top\", \"Right\", \"Bottom\", \"Left\" ];\n\
\n\
/**\n\
 * Height & Width\n\
 */\n\
\n\
each(['width', 'height'], function(name) {\n\
  exports[name] = {};\n\
\n\
  exports[name].get = function(el, compute, extra) {\n\
    if (!compute) return;\n\
    // certain elements can have dimension info if we invisibly show them\n\
    // however, it must have a current display style that would benefit from this\n\
    return 0 == el.offsetWidth && rdisplayswap.test(css(el, 'display'))\n\
      ? swap(el, cssShow, function() { return getWidthOrHeight(el, name, extra); })\n\
      : getWidthOrHeight(el, name, extra);\n\
  }\n\
\n\
  exports[name].set = function(el, val, extra) {\n\
    var styles = extra && styles(el);\n\
    return setPositiveNumber(el, val, extra\n\
      ? augmentWidthOrHeight(el, name, extra, 'border-box' == css(el, 'boxSizing', false, styles), styles)\n\
      : 0\n\
    );\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Opacity\n\
 */\n\
\n\
exports.opacity = {};\n\
exports.opacity.get = function(el, compute) {\n\
  if (!compute) return;\n\
  var ret = computed(el, 'opacity');\n\
  return '' == ret ? '1' : ret;\n\
}\n\
\n\
/**\n\
 * Utility: Set Positive Number\n\
 *\n\
 * @param {Element} el\n\
 * @param {Mixed} val\n\
 * @param {Number} subtract\n\
 * @return {Number}\n\
 */\n\
\n\
function setPositiveNumber(el, val, subtract) {\n\
  var matches = rnumsplit.exec(val);\n\
  return matches ?\n\
    // Guard against undefined 'subtract', e.g., when used as in cssHooks\n\
    Math.max(0, matches[1]) + (matches[2] || 'px') :\n\
    val;\n\
}\n\
\n\
/**\n\
 * Utility: Get the width or height\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @return {String}\n\
 */\n\
\n\
function getWidthOrHeight(el, prop, extra) {\n\
  // Start with offset property, which is equivalent to the border-box value\n\
  var valueIsBorderBox = true;\n\
  var val = prop === 'width' ? el.offsetWidth : el.offsetHeight;\n\
  var styles = computed(el);\n\
  var isBorderBox = support.boxSizing && css(el, 'boxSizing') === 'border-box';\n\
\n\
  // some non-html elements return undefined for offsetWidth, so check for null/undefined\n\
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285\n\
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668\n\
  if (val <= 0 || val == null) {\n\
    // Fall back to computed then uncomputed css if necessary\n\
    val = computed(el, prop, styles);\n\
\n\
    if (val < 0 || val == null) {\n\
      val = el.style[prop];\n\
    }\n\
\n\
    // Computed unit is not pixels. Stop here and return.\n\
    if (rnumnonpx.test(val)) {\n\
      return val;\n\
    }\n\
\n\
    // we need the check for style in case a browser which returns unreliable values\n\
    // for getComputedStyle silently falls back to the reliable el.style\n\
    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === el.style[prop]);\n\
\n\
    // Normalize ', auto, and prepare for extra\n\
    val = parseFloat(val) || 0;\n\
  }\n\
\n\
  // use the active box-sizing model to add/subtract irrelevant styles\n\
  extra = extra || (isBorderBox ? 'border' : 'content');\n\
  val += augmentWidthOrHeight(el, prop, extra, valueIsBorderBox, styles);\n\
  return val + 'px';\n\
}\n\
\n\
/**\n\
 * Utility: Augment the width or the height\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @param {Boolean} isBorderBox\n\
 * @param {Array} styles\n\
 */\n\
\n\
function augmentWidthOrHeight(el, prop, extra, isBorderBox, styles) {\n\
  // If we already have the right measurement, avoid augmentation,\n\
  // Otherwise initialize for horizontal or vertical properties\n\
  var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : 'width' == prop ? 1 : 0;\n\
  var val = 0;\n\
\n\
  for (; i < 4; i += 2) {\n\
    // both box models exclude margin, so add it if we want it\n\
    if (extra === 'margin') {\n\
      val += css(el, extra + cssExpand[i], true, styles);\n\
    }\n\
\n\
    if (isBorderBox) {\n\
      // border-box includes padding, so remove it if we want content\n\
      if (extra === 'content') {\n\
        val -= css(el, 'padding' + cssExpand[i], true, styles);\n\
      }\n\
\n\
      // at this point, extra isn't border nor margin, so remove border\n\
      if (extra !== 'margin') {\n\
        val -= css(el, 'border' + cssExpand[i] + 'Width', true, styles);\n\
      }\n\
    } else {\n\
      // at this point, extra isn't content, so add padding\n\
      val += css(el, 'padding' + cssExpand[i], true, styles);\n\
\n\
      // at this point, extra isn't content nor padding, so add border\n\
      if (extra !== 'padding') {\n\
        val += css(el, 'border' + cssExpand[i] + 'Width', true, styles);\n\
      }\n\
    }\n\
  }\n\
\n\
  return val;\n\
}\n\
//@ sourceURL=component-css/lib/hooks.js"
));
require.register("component-css/lib/styles.js", Function("exports, require, module",
"/**\n\
 * Expose `styles`\n\
 */\n\
\n\
module.exports = styles;\n\
\n\
/**\n\
 * Get all the styles\n\
 *\n\
 * @param {Element} el\n\
 * @return {Array}\n\
 */\n\
\n\
function styles(el) {\n\
  if (window.getComputedStyle) {\n\
    return el.ownerDocument.defaultView.getComputedStyle(el, null);\n\
  } else {\n\
    return el.currentStyle;\n\
  }\n\
}\n\
//@ sourceURL=component-css/lib/styles.js"
));
require.register("component-css/lib/vendor.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var prefixes = ['Webkit', 'O', 'Moz', 'ms'];\n\
\n\
/**\n\
 * Expose `vendor`\n\
 */\n\
\n\
module.exports = vendor;\n\
\n\
/**\n\
 * Get the vendor prefix for a given property\n\
 *\n\
 * @param {String} prop\n\
 * @param {Object} style\n\
 * @return {String}\n\
 */\n\
\n\
function vendor(prop, style) {\n\
  // shortcut for names that are not vendor prefixed\n\
  if (style[prop]) return prop;\n\
\n\
  // check for vendor prefixed names\n\
  var capName = prop[0].toUpperCase() + prop.slice(1);\n\
  var original = prop;\n\
  var i = prefixes.length;\n\
\n\
  while (i--) {\n\
    prop = prefixes[i] + capName;\n\
    if (prop in style) return prop;\n\
  }\n\
\n\
  return original;\n\
}\n\
//@ sourceURL=component-css/lib/vendor.js"
));
require.register("component-css/lib/support.js", Function("exports, require, module",
"/**\n\
 * Support values\n\
 */\n\
\n\
var reliableMarginRight;\n\
var boxSizingReliableVal;\n\
var pixelPositionVal;\n\
var clearCloneStyle;\n\
\n\
/**\n\
 * Container setup\n\
 */\n\
\n\
var docElem = document.documentElement;\n\
var container = document.createElement('div');\n\
var div = document.createElement('div');\n\
\n\
/**\n\
 * Clear clone style\n\
 */\n\
\n\
div.style.backgroundClip = 'content-box';\n\
div.cloneNode(true).style.backgroundClip = '';\n\
exports.clearCloneStyle = div.style.backgroundClip === 'content-box';\n\
\n\
container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';\n\
container.appendChild(div);\n\
\n\
/**\n\
 * Pixel position\n\
 *\n\
 * Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084\n\
 * getComputedStyle returns percent when specified for top/left/bottom/right\n\
 * rather than make the css module depend on the offset module, we just check for it here\n\
 */\n\
\n\
exports.pixelPosition = function() {\n\
  if (undefined == pixelPositionVal) computePixelPositionAndBoxSizingReliable();\n\
  return pixelPositionVal;\n\
}\n\
\n\
/**\n\
 * Reliable box sizing\n\
 */\n\
\n\
exports.boxSizingReliable = function() {\n\
  if (undefined == boxSizingReliableVal) computePixelPositionAndBoxSizingReliable();\n\
  return boxSizingReliableVal;\n\
}\n\
\n\
/**\n\
 * Reliable margin right\n\
 *\n\
 * Support: Android 2.3\n\
 * Check if div with explicit width and no margin-right incorrectly\n\
 * gets computed margin-right based on width of container. (#3333)\n\
 * WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right\n\
 * This support function is only executed once so no memoizing is needed.\n\
 *\n\
 * @return {Boolean}\n\
 */\n\
\n\
exports.reliableMarginRight = function() {\n\
  var ret;\n\
  var marginDiv = div.appendChild(document.createElement(\"div\" ));\n\
\n\
  marginDiv.style.cssText = div.style.cssText = divReset;\n\
  marginDiv.style.marginRight = marginDiv.style.width = \"0\";\n\
  div.style.width = \"1px\";\n\
  docElem.appendChild(container);\n\
\n\
  ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);\n\
\n\
  docElem.removeChild(container);\n\
\n\
  // Clean up the div for other support tests.\n\
  div.innerHTML = \"\";\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Executing both pixelPosition & boxSizingReliable tests require only one layout\n\
 * so they're executed at the same time to save the second computation.\n\
 */\n\
\n\
function computePixelPositionAndBoxSizingReliable() {\n\
  // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).\n\
  div.style.cssText = \"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;\" +\n\
    \"box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;\" +\n\
    \"position:absolute;top:1%\";\n\
  docElem.appendChild(container);\n\
\n\
  var divStyle = window.getComputedStyle(div, null);\n\
  pixelPositionVal = divStyle.top !== \"1%\";\n\
  boxSizingReliableVal = divStyle.width === \"4px\";\n\
\n\
  docElem.removeChild(container);\n\
}\n\
\n\
\n\
//@ sourceURL=component-css/lib/support.js"
));
require.register("component-css/lib/computed.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:computed');\n\
var withinDocument = require('within-document');\n\
var styles = require('./styles');\n\
\n\
/**\n\
 * Expose `computed`\n\
 */\n\
\n\
module.exports = computed;\n\
\n\
/**\n\
 * Get the computed style\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Array} precomputed (optional)\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function computed(el, prop, precomputed) {\n\
  var computed = precomputed || styles(el);\n\
  var ret;\n\
  \n\
  if (!computed) return;\n\
\n\
  if (computed.getPropertyValue) {\n\
    ret = computed.getPropertyValue(prop) || computed[prop];\n\
  } else {\n\
    ret = computed[prop];\n\
  }\n\
\n\
  if ('' === ret && !withinDocument(el)) {\n\
    debug('element not within document, try finding from style attribute');\n\
    var style = require('./style');\n\
    ret = style(el, prop);\n\
  }\n\
\n\
  debug('computed value of %s: %s', prop, ret);\n\
\n\
  // Support: IE\n\
  // IE returns zIndex value as an integer.\n\
  return undefined === ret ? ret : ret + '';\n\
}\n\
//@ sourceURL=component-css/lib/computed.js"
));
require.register("component-raf/index.js", Function("exports, require, module",
"/**\n\
 * Expose `requestAnimationFrame()`.\n\
 */\n\
\n\
exports = module.exports = window.requestAnimationFrame\n\
  || window.webkitRequestAnimationFrame\n\
  || window.mozRequestAnimationFrame\n\
  || window.oRequestAnimationFrame\n\
  || window.msRequestAnimationFrame\n\
  || fallback;\n\
\n\
/**\n\
 * Fallback implementation.\n\
 */\n\
\n\
var prev = new Date().getTime();\n\
function fallback(fn) {\n\
  var curr = new Date().getTime();\n\
  var ms = Math.max(0, 16 - (curr - prev));\n\
  var req = setTimeout(fn, ms);\n\
  prev = curr;\n\
  return req;\n\
}\n\
\n\
/**\n\
 * Cancel.\n\
 */\n\
\n\
var cancel = window.cancelAnimationFrame\n\
  || window.webkitCancelAnimationFrame\n\
  || window.mozCancelAnimationFrame\n\
  || window.oCancelAnimationFrame\n\
  || window.msCancelAnimationFrame\n\
  || window.clearTimeout;\n\
\n\
exports.cancel = function(id){\n\
  cancel.call(window, id);\n\
};\n\
//@ sourceURL=component-raf/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("component-tween/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('emitter')\n\
  , ease = require('ease');\n\
\n\
/**\n\
 * Expose `Tween`.\n\
 */\n\
\n\
module.exports = Tween;\n\
\n\
/**\n\
 * Initialize a new `Tween` with `obj`.\n\
 *\n\
 * @param {Object|Array} obj\n\
 * @api public\n\
 */\n\
\n\
function Tween(obj) {\n\
  if (!(this instanceof Tween)) return new Tween(obj);\n\
  this._from = obj;\n\
  this.ease('linear');\n\
  this.duration(500);\n\
}\n\
\n\
/**\n\
 * Mixin emitter.\n\
 */\n\
\n\
Emitter(Tween.prototype);\n\
\n\
/**\n\
 * Reset the tween.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
Tween.prototype.reset = function(){\n\
  this.isArray = Array.isArray(this._from);\n\
  this._curr = clone(this._from);\n\
  this._done = false;\n\
  this._start = Date.now();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Tween to `obj` and reset internal state.\n\
 *\n\
 *    tween.to({ x: 50, y: 100 })\n\
 *\n\
 * @param {Object|Array} obj\n\
 * @return {Tween} self\n\
 * @api public\n\
 */\n\
\n\
Tween.prototype.to = function(obj){\n\
  this.reset();\n\
  this._to = obj;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set duration to `ms` [500].\n\
 *\n\
 * @param {Number} ms\n\
 * @return {Tween} self\n\
 * @api public\n\
 */\n\
\n\
Tween.prototype.duration = function(ms){\n\
  this._duration = ms;\n\
  this._end = this._start + this._duration;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set easing function to `fn`.\n\
 *\n\
 *    tween.ease('in-out-sine')\n\
 *\n\
 * @param {String|Function} fn\n\
 * @return {Tween}\n\
 * @api public\n\
 */\n\
\n\
Tween.prototype.ease = function(fn){\n\
  fn = 'function' == typeof fn ? fn : ease[fn];\n\
  if (!fn) throw new TypeError('invalid easing function');\n\
  this._ease = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Perform a step.\n\
 *\n\
 * @return {Tween} self\n\
 * @api private\n\
 */\n\
\n\
Tween.prototype.step = function(){\n\
  if (this._done) return;\n\
\n\
  // duration\n\
  var duration = this._duration;\n\
  var end = this._end;\n\
  var now = Date.now();\n\
  var delta = now - this._start;\n\
  var done = delta >= duration;\n\
\n\
  // complete\n\
  if (done) {\n\
    this._from = this._curr;\n\
    this._done = true;\n\
    this.emit('end')\n\
    return;\n\
  }\n\
\n\
  // tween\n\
  var from = this._from;\n\
  var to = this._to;\n\
  var curr = this._curr;\n\
  var fn = this._ease;\n\
  var p = (now - this._start) / duration;\n\
  var n = fn(p);\n\
\n\
  // array\n\
  if (this.isArray) {\n\
    for (var i = 0; i < from.length; ++i) {\n\
      curr[i] = from[i] + (to[i] - from[i]) * n;\n\
    }\n\
\n\
    this._update(curr);\n\
    return this;\n\
  }\n\
\n\
  // objech\n\
  for (var k in from) {\n\
    curr[k] = from[k] + (to[k] - from[k]) * n;\n\
  }\n\
\n\
  this._update(curr);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set update function to `fn` or\n\
 * when no argument is given this performs\n\
 * a \"step\".\n\
 *\n\
 * @param {Function} fn\n\
 * @return {Tween} self\n\
 * @api public\n\
 */\n\
\n\
Tween.prototype.update = function(fn){\n\
  if (0 == arguments.length) return this.step();\n\
  this._update = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Clone `obj`.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
function clone(obj) {\n\
  if (Array.isArray(obj)) return obj.slice();\n\
  var ret = {};\n\
  for (var key in obj) ret[key] = obj[key];\n\
  return ret;\n\
}//@ sourceURL=component-tween/index.js"
));
require.register("component-scroll-to/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Tween = require('tween');\n\
var raf = require('raf');\n\
\n\
/**\n\
 * Expose `scrollTo`.\n\
 */\n\
\n\
module.exports = scrollTo;\n\
\n\
/**\n\
 * Scroll to `(x, y)`.\n\
 *\n\
 * @param {Number} x\n\
 * @param {Number} y\n\
 * @api public\n\
 */\n\
\n\
function scrollTo(x, y, options) {\n\
  options = options || {};\n\
\n\
  // start position\n\
  var start = scroll();\n\
\n\
  // setup tween\n\
  var tween = Tween(start)\n\
    .ease(options.ease || 'out-circ')\n\
    .to({ top: y, left: x })\n\
    .duration(options.duration || 1000);\n\
\n\
  // scroll\n\
  tween.update(function(o){\n\
    window.scrollTo(o.left | 0, o.top | 0);\n\
  });\n\
\n\
  // handle end\n\
  tween.on('end', function(){\n\
    animate = function(){};\n\
  });\n\
\n\
  // animate\n\
  function animate() {\n\
    raf(animate);\n\
    tween.update();\n\
  }\n\
\n\
  animate();\n\
  \n\
  return tween;\n\
}\n\
\n\
/**\n\
 * Return scroll position.\n\
 *\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function scroll() {\n\
  var y = window.pageYOffset || document.documentElement.scrollTop;\n\
  var x = window.pageXOffset || document.documentElement.scrollLeft;\n\
  return { top: y, left: x };\n\
}\n\
//@ sourceURL=component-scroll-to/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
    prefix = bind !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  el[bind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  el[unbind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};//@ sourceURL=component-event/index.js"
));
require.register("yields-status/index.js", Function("exports, require, module",
"\n\
/**\n\
 * dependencies.\n\
 */\n\
\n\
var emitter = require('emitter')\n\
  , event = require('event');\n\
\n\
/**\n\
 * timeoutid.\n\
 */\n\
\n\
var tid;\n\
\n\
/**\n\
 * export `status`.\n\
 */\n\
\n\
module.exports = status;\n\
\n\
/**\n\
 * register `fn` to be invoked on `e`.\n\
 * \n\
 * example:\n\
 * \n\
 *      status('active', function(){});\n\
 *      status('idle', function(){});\n\
 * \n\
 * @param {String} e\n\
 * @param {Function} fn\n\
 */\n\
\n\
function status(e, fn){\n\
  status.on(e, fn);\n\
}\n\
\n\
/**\n\
 * onchange\n\
 */\n\
\n\
status.change = function(){\n\
  status.idle && status.emit('active');\n\
  status.idle = null;\n\
  if (tid) clearTimeout(tid);\n\
  tid = setTimeout(function(){\n\
    status.idle = true;\n\
    status.emit('idle');\n\
  }, status.timeout);\n\
};\n\
\n\
/**\n\
 * start watching.\n\
 */\n\
\n\
status.watch = function(timeout){\n\
  event.bind(window, 'mousemove', status.change, false);\n\
  event.bind(window, 'keyup', status.change, false);\n\
  status.timeout = timeout || 6e4;\n\
  tid = setTimeout(function(){\n\
    status.idle = true;\n\
    status.emit('idle');\n\
  }, status.timeout);\n\
};\n\
\n\
/**\n\
 * stop watching.\n\
 */\n\
\n\
status.unwatch = function(){\n\
  event.unbind(window, 'mousemove', status.change);\n\
  event.unbind(window, 'keyup', status.change);\n\
  clearTimeout(tid);\n\
};\n\
\n\
/**\n\
 * mixin emitter.\n\
 */\n\
\n\
emitter(status);\n\
//@ sourceURL=yields-status/index.js"
));
require.register("engl/index.js", Function("exports, require, module",
"var ease = require('ease');\n\
var css = require('css');\n\
var raf = require('raf');\n\
var query = require('query');\n\
var scrollTo = require('scroll-to');\n\
var status = require('status');\n\
\n\
// elements\n\
var credits = query('#credits');\n\
var mobius = query.all('.mobius');\n\
var mobi = [];\n\
for (var i = 0; i < mobius.length; i++) {\n\
    var m = mobius[i];\n\
    var words = [];\n\
    //for(var j = 0; j < m.children.length; j++) {\n\
    //    var c = m.children[j];\n\
    //    c.textContent.split(' ').forEach(function(w) {\n\
    //        words.push(w);\n\
    //    });\n\
    //}\n\
    //while(m.children.length > 0) m.removeChild(m.firstChild)\n\
    //words.forEach(function(word) {\n\
    //    var li = document.createElement('li');\n\
    //    li.textContent = word;\n\
    //    m.appendChild(li);\n\
    //});\n\
\n\
    mobi.push({\n\
        mobius: mobius[i],\n\
        lines: query.all('li', mobius[i])\n\
    });\n\
    css(mobius[i], {\n\
        transformStyle: 'preserve-3d',\n\
        perspectiveOrigin: '0 -810px',\n\
        perspective: '1140px'\n\
    });\n\
}\n\
\n\
// constants\n\
var height = 10000;\n\
var width = 5000;\n\
var actualHeight = height - window.innerHeight;\n\
var actualWidth = width - window.innerWidth;\n\
var maxRadius = 250;\n\
var tau = Math.PI * 2;\n\
var white = {r:255, g:255, b:255};\n\
var black = {r:0, g:0, b:0};\n\
\n\
// state\n\
var stateFns = {\n\
    radius: function (x, y) {\n\
        return function(i, n) {\n\
            return i == Math.floor(n * y) ? Math.sin(y * tau * 1.5) * maxRadius : 0;\n\
        };\n\
    },\n\
    opacity: function(x, y) {\n\
        return function(i, n) {\n\
            return i == Math.floor(n * y) ? Math.sin(y * tau * 3 - 1.5) * 0.5 + 0.5 : 0;\n\
        };\n\
    },\n\
    spin: function (x, y) { return x * 360; }\n\
};\n\
var state = {};\n\
\n\
// init\n\
css(document.body, 'height', height);\n\
css(document.body, 'width', width);\n\
window.addEventListener('scroll', onScroll);\n\
query('#demo').addEventListener('click', demo);\n\
render();\n\
\n\
function render() {\n\
    resolveState();\n\
\n\
    // lines\n\
    for (var i = 0; i < mobi.length; i++) {\n\
        var mobius = mobi[i].mobius;\n\
        var lines = mobi[i].lines;\n\
        var step = 360 / lines.length;\n\
        css(mobius, 'opacity', '' + state.opacity(i, mobi.length));\n\
\n\
        for (var j = 0; j < lines.length; j++) {\n\
            var line = lines[j];\n\
            var d = -1 * step * j + state.spin;\n\
            var style = [\n\
                'rotateY('+ d +'deg)',\n\
                'translateZ('+ state.radius(i, mobi.length) +'px)',\n\
                'rotateX('+ d +'deg)',\n\
                'rotateZ(90deg)'\n\
            ].join(' ');\n\
            css(line, 'transform', style);\n\
        }\n\
    }\n\
}\n\
\n\
function onScroll(e) {\n\
    raf(render);\n\
}\n\
\n\
function resolveState() {\n\
    var xp = window.scrollX / actualWidth;\n\
    var yp = window.scrollY / actualHeight;\n\
    for(var k in stateFns) {\n\
        state[k] = stateFns[k](xp, yp);\n\
    }\n\
}\n\
\n\
function demo() {\n\
    scrollTo(actualWidth, actualHeight, {\n\
        duration: 1000 * 10,\n\
        ease: 'linear'\n\
    });\n\
}\n\
//@ sourceURL=engl/index.js"
));




















require.alias("component-query/index.js", "engl/deps/query/index.js");
require.alias("component-query/index.js", "query/index.js");

require.alias("component-ease/index.js", "engl/deps/ease/index.js");
require.alias("component-ease/index.js", "ease/index.js");

require.alias("component-css/index.js", "engl/deps/css/index.js");
require.alias("component-css/lib/css.js", "engl/deps/css/lib/css.js");
require.alias("component-css/lib/prop.js", "engl/deps/css/lib/prop.js");
require.alias("component-css/lib/swap.js", "engl/deps/css/lib/swap.js");
require.alias("component-css/lib/style.js", "engl/deps/css/lib/style.js");
require.alias("component-css/lib/hooks.js", "engl/deps/css/lib/hooks.js");
require.alias("component-css/lib/styles.js", "engl/deps/css/lib/styles.js");
require.alias("component-css/lib/vendor.js", "engl/deps/css/lib/vendor.js");
require.alias("component-css/lib/support.js", "engl/deps/css/lib/support.js");
require.alias("component-css/lib/computed.js", "engl/deps/css/lib/computed.js");
require.alias("component-css/index.js", "engl/deps/css/index.js");
require.alias("component-css/index.js", "css/index.js");
require.alias("component-each/index.js", "component-css/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("visionmedia-debug/index.js", "component-css/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "component-css/deps/debug/debug.js");

require.alias("ianstormtaylor-to-camel-case/index.js", "component-css/deps/to-camel-case/index.js");
require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-camel-case/deps/to-space-case/index.js");
require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-to-space-case/deps/to-no-case/index.js");

require.alias("component-within-document/index.js", "component-css/deps/within-document/index.js");

require.alias("component-css/index.js", "component-css/index.js");
require.alias("component-raf/index.js", "engl/deps/raf/index.js");
require.alias("component-raf/index.js", "raf/index.js");

require.alias("component-scroll-to/index.js", "engl/deps/scroll-to/index.js");
require.alias("component-scroll-to/index.js", "engl/deps/scroll-to/index.js");
require.alias("component-scroll-to/index.js", "scroll-to/index.js");
require.alias("component-raf/index.js", "component-scroll-to/deps/raf/index.js");

require.alias("component-tween/index.js", "component-scroll-to/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("component-scroll-to/index.js", "component-scroll-to/index.js");
require.alias("yields-status/index.js", "engl/deps/status/index.js");
require.alias("yields-status/index.js", "status/index.js");
require.alias("component-emitter/index.js", "yields-status/deps/emitter/index.js");

require.alias("component-event/index.js", "yields-status/deps/event/index.js");

require.alias("engl/index.js", "engl/index.js");