define(
  [
  './DeckModel',
  './HealthModel'
],
function(
  DeckModel,
  HealthModel
){
  var ExerciseDeckModel = DeckModel.extend({
    defaults: {
      result: null
    },

    initialize: function(){
      var health = this.get('health');
      if (! (health instanceof HealthModel)){
        this.set('health', new HealthModel(health));
      }
    }
  });

  return ExerciseDeckModel;
});
