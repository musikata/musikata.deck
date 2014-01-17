define(
  [
  'underscore',
  './BaseDeckModel',
  './HealthModel'
],
function(
  _,
  BaseDeckModel,
  HealthModel
){
  var ExerciseDeckModel = BaseDeckModel.extend({
    defaults: _.extend({}, BaseDeckModel.prototype.defaults, {
      result: null
    }),

    initialize: function(){
      BaseDeckModel.prototype.initialize.apply(this, arguments);
      var health = this.get('health');
      if (! (health instanceof HealthModel)){
        this.set('health', new HealthModel(health));
      }
    }
  });

  return ExerciseDeckModel;
});
