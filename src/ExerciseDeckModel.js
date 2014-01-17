define(
  [
  'backbone',
  './HealthModel'
],
function(
  Backbone,
  HealthModel
){
  var ExerciseDeckModel = Backbone.Model.extend({
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
