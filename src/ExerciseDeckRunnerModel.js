define(function(require){
  var Backbone = require('backbone');
  var HealthModel = require('./HealthModel');
  var DeckModel = require('./DeckModel');

  var ExerciseDeckRunnerModel = Backbone.Model.extend({

    primaryDeckAttr: 'deck',

    defaults: {
      result: null,
      deck: null
    },

    initialize: function(){
      // @TODO: add better safety checks for health model?
      // Or put these in HealthModel itself.
      var health = this.get('health');
      if (! (health instanceof HealthModel)){
        this.set('health', new HealthModel(health));
      }

      var primaryDeck = this.get(this.primaryDeckAttr);
      if (! (primaryDeck instanceof DeckModel)){
        this.set(this.primaryDeckAttr, new DeckModel(primaryDeck, {parse: true}));
      }
    }
  });

  return ExerciseDeckRunnerModel;
});
