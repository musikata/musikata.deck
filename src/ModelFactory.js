define(
  [
    'underscore'
],
function(_){

  var ModelFactory = function(options){
    options = options || {};
    this._handlers = {};
  };

  _.extend(ModelFactory.prototype, {
    addHandler: function(type, handler, options){

      // Throw error for key collisions.
      if (! _.isUndefined(this._handlers[type])){
        throw new Error("Key collision: handler already set for type '" 
                        + type + "', please unregister the "
                        + "existing handler before setting a new one.");
      }

      this._handlers[type] = handler;
    },

    removeHandler: function(type){
      delete this._handlers[type];
    },

    getHandler: function(type){
      var handler = this._handlers[type];
      if (_.isUndefined(handler)){
        throw new Error("No handler for type '" + type + "'.");
      }
      return handler;
    },

    createModel: function(options){
      var ModelClass = this.getHandler(options.type);
      return new ModelClass(options);
    }
  });

  return ModelFactory;
});
