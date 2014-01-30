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
      var health = this.get('health');
      if (! (health instanceof HealthModel)){
        this.set('health', new HealthModel(health));
      }

      var primaryDeck = this.get(this.primaryDeckAttr);
      if (! (primaryDeck instanceof DeckModel)){
        this.set(this.primaryDeckAttr, new DeckModel(primaryDeck, {parse: true}));
      }

      var progress = this.get('progress');
      if (! (progress instanceof ProgressModel)){
        var progressModel = new ProgressModel(progress);
        var numSlides = this.get(this.primaryDeckAttr).get('slides').length;
        progressModel.set('size', numSlides);
        this.set('progress', progressModel);
      }
    }
  });

  return ExerciseDeckRunnerModel;
});
