define(function(require){
  var _ = require('underscore');


  var ModelFactory = function(injector){
    this.injector = injector;
  };

  _.extend(ModelFactory.prototype, {
    createModel: function(attrs, options){
      var defaults = { parse: true, modelFactory: this };
      var ModelClass = this.injector.resolve(attrs.type);
      return new ModelClass(attrs, _.extend(defaults, options));
    }
  });

  return ModelFactory;
});
