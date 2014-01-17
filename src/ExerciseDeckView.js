define(
  [
  'underscore',
  './BaseDeckView',
  'handlebars',
  'text!./templates/ExerciseDeckView.html',
  './HealthView'
],function(
  _,
  BaseDeckView,
  Handlebars,
  ExerciseDeckViewTemplate,
  HealthView
){
  var ExerciseDeckView = BaseDeckView.extend({
    template: Handlebars.compile(ExerciseDeckViewTemplate), 

    regions: _.extend({}, BaseDeckView.prototype.regions, {
      health: '.health'
    }),

    onRender: function(){
      BaseDeckView.prototype.onRender.apply(this, arguments);

      // Listen for health events.
      this.healthModel = this.model.get('health');
      this.healthModel.on('empty', this.onHealthEmpty, this);
      
      // Render health view.
      this.health.show(new HealthView({model: this.healthModel}));

    },

    onSlideShow: function(slideView){
      BaseDeckView.prototype.onSlideShow.apply(this, arguments);
      // Listen for slide submission events.
      slideView.model.on('change:result', this.onChangeSlideResult, this);
    },

    onSlideClose: function(slideView){
      BaseDeckView.prototype.onSlideClose.apply(this, arguments);
      // Stop listening to slide events.
      // Does marionette do this for us?
      //slideView.model.off('change:result', this.onChangeSlideResult, this);
    },

    onChangeSlideResult: function(model){
      var result = model.get('result');
      if (result == 'pass'){
        // Nothing here yet...
      }
      else if (result == 'fail'){
        this.healthModel.decrementCurrentHealth();
      }

      this.enableNextButton();
    },

    onHealthEmpty: function(){
      this.model.set('result', 'fail');
    },

    onCompleted: function(){
      BaseDeckView.prototype.onCompleted.apply(this, arguments);
      if (this.healthModel.get('currentHealth') > 0){
        this.model.set('result', 'pass');
      }
      else{
        this.model.set('result', 'fail');
      }
    }
  });

  return ExerciseDeckView;
});

