define(function(require){

  var _ = require('underscore');
  var Bacbone = require('backbone');
  var ModelFactory = require('./ModelFactory');
  var ViewFactory = require('./ViewFactory');
  var HtmlView = require('./HtmlView');
  var CompositeModel = require('./CompositeModel');
  var CompositeView = require('./CompositeView');
  var DeckModel = require('./DeckModel');
  var DeckView = require('./DeckView');

  var DeckFactory = function(options){
    options = options || {};
    this.modelFactory = options.modelFactory || new ModelFactory();
    this.viewFactory = options.viewFactory || new ViewFactory();

    // Register handling for core model types.
    this.modelFactory.addHandler('html', Backbone.Model);
    this.modelFactory.addHandler('composite', CompositeModel);

    // Register handling for core view types.
    this.viewFactory.addHandler('html', _.bind(function(options){
      return new HtmlView(options);
    }, this));
    this.viewFactory.addHandler('composite', _.bind(function(options){
      return new CompositeView(_.extend({
        viewFactory: this.viewFactory
      }, options));
    }, this));
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
