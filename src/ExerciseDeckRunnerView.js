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
    attributes: {
      class: 'exercise-deck-runner'
    },

    template: Handlebars.compile(ExerciseDeckRunnerViewTemplate), 

    regions: {
      body: '.body-container',
      health: '.health-container',
      nav: '.nav-container',
      progress: '.progress-container'
    },

    ui: {
      nextButton: '[data-role="nextButton"]',
      previousButton: '[data-role="previousButton"]',
      progressBar: '.progress-bar'
    },

    initialize: function(options){
      this.primaryDeckModel = options.model.get(options.model.primaryDeckAttr);

      // Listen for deck completion
      this.on('primaryDeck:completed', this.onPrimaryDeckCompleted, this);
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

      var deckView = new DeckView({
        model: this.primaryDeckModel,
        viewFactory: this.options.viewFactory
      });
      var slides = this.primaryDeckModel.get('slides');

      // Update progress when slide changes.
      this.listenTo(deckView.model, 'change:currentSlideIndex', function(model, slideIdx){
        this.progressModel.set('currentProgress', slideIdx);
      }, this);

      // Update nav when slides show
      this.listenTo(deckView, 'slide:show', function(slideView){
        this.updateNavForSlide(slideView);
        // Listen for slide submission results.
        this.listenTo(slideView.model.get('submission'), 'change:result', function(submission, result){
          if (result == 'pass'){
            // Nothing here yet...
          }
          else if (result == 'fail'){
            this.healthModel.decrementCurrentHealth();
          }
        }, this);
      }, this);

      // Route nav events to view.
      deckView.listenTo(this.navView, 'button:clicked', function(buttonView, eventId){
        deckView.trigger(eventId);
      });

      // On last slide, 'continue' should trigger completion.
      this.listenToOnce(deckView, 'lastSlide', function(){
        deckView.stopListening(this.navView);
        this.listenToOnce(this.navView, 'button:clicked', function(buttonView, eventId){
          if (eventId == 'continue'){
            deckView.trigger('deck:completed');
          }
        });
      }, this);

      // Listen for completion event.
      this.listenTo(deckView, 'deck:completed', function(){
        this.onPrimaryDeckCompleted();
      }, this);

      this.body.show(deckView);

    },

    updateNavForSlide: function(slideView){
      // @TODO: Refactor this later. This is the first attempt,
      // prolly gonna be wicked kludgy at first. But let's get it out there.
      var submissionType = slideView.submissionType;
      var submission = slideView.model.get('submission');
      var navCollection = this.nav.currentView.collection;

      // Manual submissions: check -> checking -> continue.
      if (submissionType == 'manual'){

        // Initial state: disabled check button.
        var buttonModel = new Backbone.Model({label: 'check', eventId: 'check', disabled: true})
        navCollection.reset([buttonModel]);

        // If submission is empty, disable check button.
        // otherwise, enable check button.
        submission.on('change:data', function(submission, data){
          buttonModel.set('disabled', _.isUndefined(data));
        });

        submission.on('change:state', function(model, state){
          // If submitting, change to checking.
          if (state === 'submitting'){
            buttonModel.set({
              label: 'checking',
              disabled: true
            });
          }
          // If submission complete, change to 'continue'.
          else if (state === 'completed'){
            buttonModel.set({
              label: 'continue',
              eventId: 'continue',
              disabled: false
            });
          }
        });

      } // end manual

      // Automatic submission: checking ->  continue.
      else if (submissionType == 'automatic'){

        // Initial state: disabled check button.
        var buttonModel = new Backbone.Model({label: 'check', eventId: 'check', disabled: true})
        navCollection.reset([buttonModel]);

        submission.on('change:state', function(submission, state){
          // If submitting, change to checking.
          if (state === 'submitting'){
            buttonModel.set({
              label: 'checking',
              disabled: true
            });
          }
          // If submission complete, change to 'continue'.
          else if (state === 'completed'){
            buttonModel.set({
              label: 'continue',
              eventId: 'continue',
              disabled: false
            });
          }
        });
      } // end automatic

      // noSubmission: continue.
      else if (! submissionType){

        // Initial state: enabled continue button.
        var buttonModel = new Backbone.Model({label: 'continue', eventId: 'continue', disabled: false})
        navCollection.reset([buttonModel]);
      } // end noSubmission
    },

    onHealthEmpty: function(){
      this.model.set('result', 'fail');
    },

    onPrimaryDeckCompleted: function(){
      if (this.healthModel.get('currentHealth') > 0){
        this.model.set('result', 'pass');
      }
      else{
        this.model.set('result', 'fail');
      }

      this.showOutroView();
    },

    showOutroView: function(){
      if (this.options.getOutroView){
        var outroView = this.options.getOutroView.apply(this);
        this.body.show(outroView);
        this.trigger('show:outroView', outroView);
      }
    }

  });

  return ExerciseDeckRunnerView;
});

