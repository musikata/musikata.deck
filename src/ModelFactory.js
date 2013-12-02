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
    addHandler: function(options){

      // Throw error for key collisions.
      if (! _.isUndefined(this._handlers[options.type])){
        throw new Error("Key collision: handler already set for type '" 
                        + options.type + "', please unregister the "
                        + "existing handler before setting a new one.");
      }

      this._handlers[options.type] = options.handler;
    },

    removeHandler: function(options){
      delete this._handlers[options.type];
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
