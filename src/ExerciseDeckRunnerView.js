/*
 * The Runner is a container and mediator between several sub-views.
 * It coordinates interactions between decks, navigation, and health-views.
 * This allows us to keep the sub-views simple, and to make their relationships
 * explicit.
 */
define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var Marionette = require('marionette');
  var DeckView = require('./DeckView');
  var HealthView = require('./HealthView');
  var ProgressView = require('./ProgressView');
  var NavigationView = require('./NavigationView');
  var ExerciseDeckRunnerViewTemplate = require('text!./templates/ExerciseDeckRunnerView.html');

  var ExerciseDeckRunnerView = Marionette.Layout.extend({
    template: Handlebars.compile(ExerciseDeckRunnerViewTemplate), 

    regions: {
      body: '.body_container',
      health: '.health_container',
      nav: '.nav_container',
      progress: '.progress_container'
    },

    ui: {
      nextButton: '[data-role="nextButton"]',
      previousButton: '[data-role="previousButton"]',
      progressBar: '.progress-bar'
    },

    initialize: function(options){
      this.primaryDeckModel = options.model.get(options.model.primaryDeckAttr);
    },

    onRender: function(){
      // Listen for health events.
      this.healthModel = this.model.get('health');
      this.healthModel.on('empty', this.onHealthEmpty, this);

      // Render health view.
      this.health.show(new HealthView({model: this.healthModel}));

      // Render progress view.
      this.progressModel = this.model.get('progress');
      this.progress.show(new ProgressView({model: this.progressModel}));

      // Render nav view and collect nav events.
      this.nav.show(new NavigationView({collection: new Backbone.Collection()}));
      this.navView = this.nav.currentView;

      // If getIntroView was provided, show intro view,
      // and listen for when it finishes.
      if (this.options.getIntroView){
        var introView = this.options.getIntroView.apply(this, []);
        introView.on('complete', this.showPrimaryDeck, this);
        this.body.show(introView);
      }
      // Otherwise just show the deck.
      else{
        this.showPrimaryDeck();
      }

    },

    showPrimaryDeck: function(){

      var primaryDeckView = new DeckView({
        model: this.primaryDeckModel,
        viewFactory: this.options.viewFactory
      });

      var slidesCollection = this.primaryDeckModel.get('slides');

      // Update progress when slide changes.
      this.primaryDeckModel.on('change:currentSlideIndex', function(model, slideIdx){
        this.progressModel.set('currentProgress', slideIdx);
      }, this);

      // Update nav when slides show
      primaryDeckView.on('slide:show', function(slideView){
        this.updateNavForSlide(slideView);
      }, this);

      // Listen for slide result changes.
      slidesCollection.on('change:result', this.onChangeSlideResult, this);

      // Listen for completion event.
      this.listenTo(primaryDeckView, 'deck:completed', this.onDeckCompleted, this);

      this.body.show(primaryDeckView);

    },

    updateNavForSlide: function(slideView){
    },

    onChangeSlideResult: function(model){
      var result = model.get('result');
      if (result == 'pass'){
        // Nothing here yet...
      }
      else if (result == 'fail'){
        this.healthModel.decrementCurrentHealth();
      }
    },

    onHealthEmpty: function(){
      this.model.set('result', 'fail');
    },

    onDeckCompleted: function(){
      this.trigger('primaryDeck:completed');

      if (this.healthModel.get('currentHealth') > 0){
        this.model.set('result', 'pass');
      }
      else{
        this.model.set('result', 'fail');
      }

      // Show outro view if given.
      if (this.options.getOutroView){
        var outroView = this.options.getOutroView(this);
        this.body.show(outroView);
        this.trigger('show:outroView', outroView);
      }
    }

  });

  return ExerciseDeckRunnerView;
});

