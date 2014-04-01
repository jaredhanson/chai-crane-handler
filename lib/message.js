/**
 * Creates an instance of `Message`.
 *
 * This class is used as a mock when testing Crane handlers, substituted in
 * place of a `Message` from the underlying message queue adapter.
 *
 * @constructor
 * @api protected
 */
function Message(cb) {
  this.topic = '/';
  this.headers = {};
  this.__cb = cb;
}

Message.prototype.ack = function() {
  if (this.__cb) { this.__cb(); }
};


/**
 * Expose `Message`.
 */
module.exports = Message;
