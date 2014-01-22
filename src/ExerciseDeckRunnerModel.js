define(function(require){
  var Backbone = require('backbone');
  var HealthModel = require('./HealthModel');
  var ProgressModel = require('./ProgressModel');
  var DeckModel = require('./DeckModel');

  var ExerciseDeckRunnerModel = Backbone.Model.extend({

    primaryDeckAttr: 'deck',

    defaults: {
      health: null,
      progress: null,
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

      var progress = this.get('progress');
      if (! (progress instanceof ProgressModel)){
        this.set('progress', new ProgressModel(progress));
      }

      var primaryDeck = this.get(this.primaryDeckAttr);
      if (! (primaryDeck instanceof DeckModel)){
        this.set(this.primaryDeckAttr, new DeckModel(primaryDeck, {parse: true}));
      }
    }
  });

  return ExerciseDeckRunnerModel;
});
