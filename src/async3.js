(function() {
  var Async3 = {};

  // use like: forEachAsyncSerial(Post.find(), (next, post) => { /* ... */ next(); }, () => { /* done! */ });
  Async3.forEachAsyncSerial = function(a, each_cb, done_cb) {
    var i = 0;
    var next = function(err) {
      if (err || i >= a.length) {
        if ('function' == typeof done_cb) done_cb();
        return;
      }
      each_cb(next, a[i], i++);
    };
    setTimeout(next, 0);
  };

  Async3.forEachAsyncParallel = function(a, each_cb, done_cb) {
    var i = 0;
    var next = function(err) {
      if (err || ++i >= a.length) {
        if ('function' === typeof done_cb) done_cb();
        return;
      }
    };
    setTimeout(function() {
      for (var j=0, len=a.length; j<len; j++)
        each_cb(next, a[j], j);
    }, 0);
  };

  Async3.whileAsyncSerial = function(test, each_cb, done_cb) {
    var next = function(err) {
      if (err || !test()) {
        if ('function' == typeof done_cb) done_cb();
        return;
      }
      each_cb(next);
    };
    setTimeout(next, 0);
  };

  Async3.forRangeAsyncParallelBatch = function(size, min, max, each_db, done_cb) {
    var range = []; for (var j=min; j<max; j++) range.push(j);
    Async3.forEachAsyncParallelBatch(size, range, each_db, done_cb);
  };

  Async3.forEachAsyncParallelBatch = function (size, a, each_cb, done_cb) {
    var i = 0, c = 0;
    var next = function(err) {
      if (!err && i < a.length) each_cb(next, a[i++]);
      else if (0 === --c && 'function' === typeof done_cb) done_cb();
    };

    setTimeout(function() {
      for (var len=Math.min(size, a.length); c<len; c++)
        each_cb(next, a[i], i++);
    }, 0);
  };

  Async3.ifAsync = function(/* test, true_fn, args..., done_cb */) {
    var args = Array.prototype.slice.call(arguments);
    var test = args.shift();
    var done_cb = args.pop();

    if (test) {
      var true_fn = args.shift();
      args.push(done_cb);
      true_fn.apply(null, args);
    }
    else {
      done_cb();
    }
  };

  if ('function' === typeof define) // Require.JS
    return define(function(require, exports, module) { module.exports = Async3; });
  else if ('function' === typeof require && typeof exports === typeof module) // Node.JS
    return module.exports = Async3;
  window.Async3 = Async3; // Browser
})();
