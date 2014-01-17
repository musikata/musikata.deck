define(
  [
  'underscore',
  './DeckView',
  'handlebars',
  'text!./templates/ExerciseDeckView.html',
  './HealthView'
],function(
  _,
  DeckView,
  Handlebars,
  ExerciseDeckViewTemplate,
  HealthView
){
  var ExerciseDeckView = DeckView.extend({
    template: Handlebars.compile(ExerciseDeckViewTemplate), 

    regions: _.extend({}, DeckView.prototype.regions, {
      health: '.health'
    }),

    onRender: function(){
      this.health.show(new HealthView({model: this.model.get('health')}));
    }
  });

  return ExerciseDeckView;
});

