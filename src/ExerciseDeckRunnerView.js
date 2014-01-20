define(function(require){

  var _ = require('underscore');
  var Handlebars = require('handlebars');
  var Marionette = require('marionette');
  var DeckView = require('./DeckView');
  var HealthView = require('./HealthView');
  var ExerciseDeckRunnerViewTemplate = require('text!./templates/ExerciseDeckRunnerView.html');

  var ExerciseDeckRunnerView = Marionette.Layout.extend({
    template: Handlebars.compile(ExerciseDeckRunnerViewTemplate), 

    regions: {
      deck: '.deck_container',
      health: '.health_container'
    },

    ui: {
      nextButton: '[data-role="nextButton"]',
      previousButton: '[data-role="previousButton"]',
      progressBar: '.progress-bar'
    },

    onRender: function(){
      // Listen for health events.
      this.healthModel = this.model.get('health');
      this.healthModel.on('empty', this.onHealthEmpty, this);

      // Listen for slide result changes.
      this.slidesCollection = this.model.get('deck').get('slides');
      this.slidesCollection.on('change:result', this.onChangeSlideResult, this);

      // Render health view.
      this.health.show(new HealthView({model: this.healthModel}));

      // Listen for completion events.
      this.on('deck:completed', this.onDeckCompleted, this);
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

    onChangeSlide: function(){
      // Update progress bar.
      // NOTE: might want to put progress bar in it's own view
      // later.
      this.updateProgressBar();
    },

    updateProgressBar: function(){
      var curIdx = this.model.get('currentSlideIndex');
      this.ui.progressBar.find('li').each(function(idx, el){
        if (idx < curIdx){
          $(el).addClass('done');
        }
        else{
          $(el).removeClass('done');
        }
      });
    },

    onHealthEmpty: function(){
      this.model.set('result', 'fail');
    },

    onDeckCompleted: function(){
      if (this.healthModel.get('currentHealth') > 0){
        this.model.set('result', 'pass');
      }
      else{
        this.model.set('result', 'fail');
      }
    },

    // NOTE: later on might want to factor out nav buttons into their own view.
    enableNextButton: function(){
      this.ui.nextButton.addClass('enabled');
      this.ui.nextButton.on('click', _.bind(this.onClickNextButton, this));
    },

    disableNextButton: function(){
      this.ui.nextButton.removeClass('enabled');
      this.ui.nextButton.off('click');
    },

    onClickNextButton: function(){
      if (this.model.get('currentSlideIndex') == this.model.get('slides').length - 1){
        this.trigger('deck:completed');
      }
      else{
        this.goToNextSlide();
      }
    },

    enablePreviousButton: function(){
      if (this.ui.previousButton.hasClass('enabled')){
        return;
      }
      this.ui.previousButton.addClass('enabled');
      this.ui.previousButton.on('click', _.bind(this.onClickPreviousButton, this));
    },

    disablePreviousButton: function(){
      this.ui.previousButton.removeClass('enabled');
      this.ui.previousButton.off('click');
    },

    onClickPreviousButton: function(){
      this.goToPreviousSlide();
    },
  });

  return ExerciseDeckRunnerView;
});

