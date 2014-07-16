/**
 * Creates an instance of `Message`.
 *
 * This class is used as a mock when testing Crane handlers, substituted in
 * place of a `Message` from the underlying message queue adapter.
 *
 * @constructor
 * @api protected
 */
function Message(cb, ncb) {
  this.topic = '/';
  this.headers = {};
  this.__cb = cb;
  this.__ncb = ncb;
}

Message.prototype.ack = function() {
  if (this.__cb) { this.__cb(); }
};

Message.prototype.nack = function() {
  if (this.__ncb) { this.__ncb(); }
};


/**
 * Expose `Message`.
 */
module.exports = Message;
