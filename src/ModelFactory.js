define(
  [
    'underscore',
    './BaseFactory'
],
function(_, BaseFactory){

  var ModelFactory = function(){
    BaseFactory.apply(this, arguments);
  };

  _.extend(ModelFactory.prototype, BaseFactory.prototype, {
    createModel: function(attrs, options){
      var defaultOptions = {
        parse: true,
        modelFactory: this
      };
      var mergedOptions = {};
      _.extend(mergedOptions, defaultOptions, options);
      var ModelClass = this.getHandler(attrs.type);
      return new ModelClass(attrs, mergedOptions);
    }
  });

  return ModelFactory;
});
