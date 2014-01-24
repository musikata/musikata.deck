define(function(require){
  var Marionette = require('marionette');
  var ExerciseDeckRunnerView = require('./ExerciseDeckRunnerView');
  var DeckView = require('./DeckView');

  var MusikataExerciseRunner = ExerciseDeckRunnerView.extend({

    initialize: function(options){

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
              template: function(){return 'Pass';}
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
              template: function(){return 'fail';}
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

          // Update nav on final intro slide.
          this.listenTo(introView, 'slide:show', function(view){
            if (introView.model.get('currentSlideIndex') == (introSlides.length - 1)){

              navCollection.reset([
                new Backbone.Model({label: 'start', eventId: 'startPrimaryDeck'})
              ]);

              // Complete intro deck when start is clicked.
              introView.on('startPrimaryDeck', function(){
                introView.trigger('complete');
              });

            }
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
