define(function(require){
  var Backbone = require('backbone');
  var HealthModel = require('./HealthModel');
  var DeckModel = require('./DeckModel');

  var ExerciseDeckRunnerModel = Backbone.Model.extend({

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

      var deck = this.get('deck');
      if (! (deck instanceof DeckModel)){
        this.set('deck', new DeckModel(deck, {parse: true}));
      }
    }
  });

  return ExerciseDeckRunnerModel;
});
