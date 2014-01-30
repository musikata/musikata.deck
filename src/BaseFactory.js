define(function(require){
  _ = require('underscore');

  var BaseFactory = function(options){
    options = options || {};
    this._handlers = {};
  };

  _.extend(BaseFactory.prototype, {
    // Like set handler, but with error checking.
    addHandler: function(type, handler){

      // Throw error for key collisions.
      if (! _.isUndefined(this._handlers[type])){
        throw new Error("Key collision: handler already set for type '"
                        + type + "', please unregister the "
                        + "existing handler before setting a new one.");
      }
      this.setHandler(type, handler);
    },

    removeHandler: function(type){
      delete this._handlers[type];
    },

    setHandler: function(type, handler){
      this._handlers[type] = handler;
    },

    getHandler: function(type){
      var handler = this._handlers[type];
      if (_.isUndefined(handler)){
        throw new Error("No handler for type '" + type + "'.");
      }
      return handler;
    },

  });

  return BaseFactory;
});
