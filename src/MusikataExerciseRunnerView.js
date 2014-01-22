define(function(require){
  var ExerciseDeckRunnerView = require('./ExerciseDeckRunnerView');
  var DeckView = require('./DeckView');

  var MusikataExerciseRunner = ExerciseDeckRunnerView.extend({
    initialize: function(options){

      // Create deck view  for intro view by default.
      if (! this.options.getIntroView){
        var _this = this;
        this.options.getIntroView = function(){

          this.nav.currentView.collection.reset([
            new Backbone.Model({label: 'continue', eventId: 'continue'})
          ]);

          return new DeckView({
            model: _this.model.get('introDeck'),
            viewFactory: options.viewFactory
          });
        }
      }

      ExerciseDeckRunnerView.prototype.initialize.apply(this, [options]);
    }
  });

  return MusikataExerciseRunner;
});
