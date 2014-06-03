/**
 * Module dependencies.
 */
var Message = require('./message')
  , flatten = require('utils-flatten');


/**
 * Creates an instance of `Test`.
 *
 * @constructor
 * @api protected
 */
function Test(callbacks) {
  this._callbacks = flatten(callbacks);
}

/**
 * Register a callback to be invoked when message is prepared.
 *
 * @param {Function} cb
 * @return {Test} for chaining
 * @api public
 */
Test.prototype.msg = function(cb) {
  this._msg = cb;
  return this;
};

/**
 * Register a callback to be invoked when handler `ack()`s response.
 *
 * @param {Function} cb
 * @return {Test} for chaining
 * @api public
 */
Test.prototype.ack = function(cb) {
  this._ack = cb;
  return this;
};

/**
 * Register a callback to be invoked when handler calls `next()`.
 *
 * @param {Function} cb
 * @return {Test} for chaining
 * @api public
 */
Test.prototype.next = function(cb) {
  this._next = cb;
  return this;
};

/**
 * Dispatch mock request to handler.
 *
 * @api public
 */
Test.prototype.dispatch = function(err) {
  var self = this
    , msg = new Message(function() {
        if (!self._ack) { throw new Error('msg#ack should not be called'); }
        self._ack.call(this, msg);
      })
    , before = this._msg;
  
  function ready() {
    function next(err) {
      if (!self._next) { throw new Error('next should not be called'); }
      self._next.call(this, err);
    }
    
    var i = 0;
    function callbacks(err) {
      var fn = self._callbacks[i++];
      if (!fn) { return next(err); }
      try {
        if (err) {
          if (fn.length < 3) { return callbacks(err); }
          fn(err, msg, callbacks);
        } else {
          fn(msg, callbacks);
        }
      } catch (err) {
        // NOTE: Route handlers are not expected to throw exceptions.  So, in
        //       the context of a unit test, exceptions are re-thrown, rather
        //       than being caught and passed to `next`.
        throw err;
      }
    }
    callbacks();
  }
  
  if (before && before.length == 2) {
    before(msg, ready);
  } else if (before) {
    before(msg);
    ready();
  } else {
    ready();
  }
};


/**
 * Expose `Test`.
 */
module.exports = Test;
