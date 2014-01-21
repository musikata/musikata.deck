define(function(require){
  var _ = require('underscore');
  var HealthModel = require('./HealthModel');
  var DeckModel = require('./DeckModel');
  var ExerciseDeckRunnerModel = require('./ExerciseDeckRunnerModel');

  var MusikataExerciseRunnerModel = ExerciseDeckRunnerModel.extend({

    primaryDeckAttr: 'exerciseDeck',

    defaults: _.extend(
      {}, 
      ExerciseDeckRunnerModel.prototype.defaults,
      {
        introDeck: null,
        exerciseDeck: null
      }
    ),

    initialize: function(){
      var introDeck = this.get('introDeck');
      if (introDeck && ! (introDeck instanceof DeckModel)){
        this.set('introDeck', new DeckModel(introDeck, {parse: true}));
      }

      ExerciseDeckRunnerModel.prototype.initialize.apply(this, arguments);
    }
  });

  return MusikataExerciseRunnerModel;
});
