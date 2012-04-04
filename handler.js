var sys = require('sys');
var events = require('events');

function Handler() {
  if(false === (this instanceof Handler)){
    return new Handler();
  };
  events.EventEmitter.call(this);
};
sys.inherits(Handler, events.EventEmitter);

module.exports = Handler;