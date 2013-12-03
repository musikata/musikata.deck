define(
  [
    'underscore',
    'backbone',
    './ModelFactory',
    './ViewFactory',
    './CompositeModel',
    './HtmlView',
    './CompositeView',
    './DeckModel',
    './DeckView'
],
function(_, Backbone, ModelFactory, ViewFactory, CompositeModel, HtmlView, CompositeView, DeckModel, DeckView){

  var DeckFactory = function(options){
    options = options || {};
    this.modelFactory = options.modelFactory || new ModelFactory();
    this.viewFactory = options.viewFactory || new ViewFactory();

    // Register handling for core model types.
    this.modelFactory.addHandler('html', Backbone.Model);
    this.modelFactory.addHandler('composite', CompositeModel);

    // Register handling for core view types.
    this.viewFactory.addHandler('html', HtmlView);
    this.viewFactory.addHandler('composite', CompositeView);
  };

  _.extend(DeckFactory.prototype, {
    createDeck: function(deckDefinition, viewOptions){
      var deckModel = new DeckModel(deckDefinition, {
        parse: true,
        modelFactory: this.modelFactory
      });

      var mergedViewOptions = _.extend({
        model: deckModel,
        viewFactory: this.viewFactory
      }, viewOptions);

      var deckView = new DeckView(mergedViewOptions);
      return deckView;
    }
  });

  return DeckFactory;
});
