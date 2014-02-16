define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');
  var ExerciseDeckRunnerView = require('./ExerciseDeckRunnerView');
  var DeckView = require('./DeckView');
  var Handlebars = require('handlebars');

  var MusikataFailViewTemplate = require('text!./templates/MusikataFailView.html');
  var MusikataPassViewTemplate = require('text!./templates/MusikataPassView.html');

  var MusikataExerciseRunner = ExerciseDeckRunnerView.extend({

    initialize: function(options){
      this.options = options;

      // Not sure if this should go here, but get it in for now.
      if (! this.options.getOutroView){
        this.options.getOutroView = function(){
          var result = this.model.get('result');

          var navCollection = this.navView.collection;

          var OutroView;
          // Pass view.
          if (result == 'pass'){
            OutroView = Marionette.ItemView.extend({
              type: 'PassView',
              className: 'pass-view',
              template: Handlebars.compile(MusikataPassViewTemplate)
            });

            navCollection.reset([
              new Backbone.Model({label: 'continue', eventId: 'continue'})
            ]);

            // Trigger redirect event click continue.
            this.listenTo(this.navView, 'button:clicked', function(buttonView, eventId){
              if (eventId == 'continue'){
                this.trigger('redirect', this.model.get('destination'));
              }
            }, this);

          }
          // 'Try Again' view.
          else if (result == 'fail'){
            OutroView = Marionette.ItemView.extend({
              type: 'FailView',
              className: 'fail-view',
              template: Handlebars.compile(MusikataFailViewTemplate)
            });

            navCollection.reset([
              new Backbone.Model({label: 'return to dojo', eventId: 'returnToDojo'}),
              new Backbone.Model({label: 'try again', eventId: 'reload'})
            ]);

            // Trigger redirect event click continue.
            this.listenTo(this.navView, 'button:clicked', function(buttonView, eventId){
              this.trigger(eventId);
            }, this);
          }

          return new OutroView({
            model: new Backbone.Model()
          });
        };
      }

      ExerciseDeckRunnerView.prototype.initialize.apply(this, [options]);
    },

    onRender: function(){

      this.$el.addClass('musikata-exercise-deck-runner');

      // Create deck view for intro view if introSlides were given
      var introSlides = this.model.get('introDeck').get('slides');
      if (! this.options.getIntroView && introSlides && (introSlides.length > 0)){

        this.options.getIntroView = function(){
          var navCollection = this.navView.collection;
          navCollection.reset([
            new Backbone.Model({label: 'continue', eventId: 'continue'})
          ]);

          var introView = new DeckView({
            model: this.model.get('introDeck'),
            viewFactory: this.options.viewFactory
          });

          // Route nav events to introView.
          introView.listenTo(this.navView, 'button:clicked', function(buttonView, eventId){
            introView.trigger(eventId);
          });

          // Update nav on last intro slide.
          this.listenToOnce(introView, 'lastSlide', function(){
            introView.stopListening(this.navView);

            navCollection.reset([
              new Backbone.Model({label: 'start', eventId: 'startPrimaryDeck'})
            ]);

            // Complete intro deck when start is clicked.
            this.listenToOnce(this.navView, 'button:clicked', function(buttonView, eventId){
              if (eventId == 'startPrimaryDeck'){
                introView.trigger('complete');
              }
            });
          }, this);

          return introView;

        }
      }

      ExerciseDeckRunnerView.prototype.onRender.apply(this);

    },

    updateNavForSlide: function(slideView){
      ExerciseDeckRunnerView.prototype.updateNavForSlide.apply(this, [slideView]);
    },

  });

  return MusikataExerciseRunner;
});
