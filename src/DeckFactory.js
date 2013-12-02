define(
  [
    'underscore',
    'backbone',
    './ModelFactory',
    './CompositeModel'
],
function(_, Backbone, ModelFactory, CompositeModel){

  var DeckFactory = function(options){
    options = options || {};
    this.modelFactory = options.modelFactory || new ModelFactory();

    // Register core plugins.
    this.modelFactory.addHandler('html', Backbone.Model);
    this.modelFactory.addHandler('composite', CompositeModel);
  };

  _.extend(DeckFactory.prototype, {
  });

  return DeckFactory;
});
