module.exports = function(chai, _) {
  var Test = require('./test');
  
  chai.crane = chai.connect || {};
  chai.crane.handler = function(callbacks) {
    return new Test(callbacks);
  };
};
