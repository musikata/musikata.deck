define(
  [
    'underscore',
    'backbone',
    './ModelFactory',
    './CompositeModel',
    './DeckModel',
    './DeckView'
],
function(_, Backbone, ModelFactory, CompositeModel, DeckModel, DeckView){

  var DeckFactory = function(options){
    options = options || {};
    this.modelFactory = options.modelFactory || new ModelFactory();

    // Register core plugins.
    this.modelFactory.addHandler('html', Backbone.Model);
    this.modelFactory.addHandler('composite', CompositeModel);
  };

  _.extend(DeckFactory.prototype, {
    createDeck: function(deckDefinition, viewOptions){
      var deckModel = new DeckModel(deckDefinition, {
        parse: true,
        modelFactory: this.modelFactory
      });

      var mergedViewOptions = _.extend({
        model: deckModel
      }, viewOptions);

      var deckView = new DeckView(mergedViewOptions);
      return deckView;
    }
  });

  return DeckFactory;
});
