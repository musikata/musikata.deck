define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ViewFactory = require('deck/ViewFactory');
  var DeckModel = require('deck/DeckModel');
  var DeckView = require('deck/DeckView');
  var ExerciseDeckRunnerModel = require('deck/ExerciseDeckRunnerModel');
  var ExerciseDeckRunnerView = require('deck/ExerciseDeckRunnerView');

  // Define a dummy intro view.
  // @TODO: Should this extend from an IntroView base class? To make
  // the interface explicit?
  var SillyView = Marionette.ItemView.extend({
    template: Handlebars.compile('<div>Beans!</div>')
  });

  // Define a test exercise.
  var SillyExercise = Marionette.ItemView.extend({
    template: Handlebars.compile(
      '<button id="pass" value="pass"><button id="fail" value="fail">'
    ),
    events: {
      'click button': 'onButtonClick'
    },
    onRender: function(){
      this.trigger('ready');
    },
    onButtonClick: function(e){
      var passFail = $(e.target).attr("id");
      this.model.set('result', passFail);
    }
  });

  /*
   * Define generator functions.
   */

  var generateViewFactory = function(){
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('silly', SillyExercise);
    return viewFactory;
  };

  var generateTestModels = function(options){
    var defaultOptions = {
      numSlides: 4
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    var slideModels = [];
    for(var i=0; i < mergedOptions.numSlides; i++){
      slideModels.push(new Backbone.Model({type: 'silly'}));
    }
    testModels.slides = new Backbone.Collection(slideModels);

    testModels.deck = new DeckModel({
      slides: testModels.slides
    }, {parse: true});

    testModels.runner = new ExerciseDeckRunnerModel({
      deck: testModels.deck
    });

    return testModels;
  };

  var generateRunnerView = function(overrides){

    var opts = _.extend({
      model: generateTestModels().runner,
      getIntroView: null,
      getCompletionView: null,
      viewFactory: generateViewFactory()
    }, overrides);

    var runnerView = new ExerciseDeckRunnerView(opts);

    return runnerView;
  };

  describe('ExerciseDeckRunnerView', function(){

    it('should be defined', function(){
      expect(ExerciseDeckRunnerView).toBeDefined();
    });

    it('should display health', function(){
      var view = generateRunnerView();
      view.render();
      expect(view.health.$el.length).toEqual(1);
      view.remove();
    });

    describe('before deck starts', function(){
      it('should show an intro view if one was provided', function(){
        var view = generateRunnerView({
          getIntroView: function(){
            return new SillyView({
              model: new Backbone.Model({id: 'intro'})
            });
          }
        });
        view.render();
        expect(view.body.currentView.model.get('id')).toEqual('intro');
      });

      it('should show the first slide if no intro view was given', function(){
        var view = generateRunnerView();
        view.render();
        var deckModel = view.model.get('deck');
        expect(view.body.currentView.model).toBe(deckModel);
      });

      it('should show the first slide when the intro view completes', function(){
        var introView = new SillyView({
          model: new Backbone.Model({id: 'intro'})
        });

        var view = generateRunnerView({
          getIntroView: function(){
            return introView
          }
        });
        view.render();

        introView.trigger('complete');

        var deckModel = view.model.get('deck');
        var currentSlideView = view.body.currentView.slide.currentView;
        expect(currentSlideView.model).toBe(deckModel.get('slides').at(0));
      });
    });


    describe('while deck is running', function(){
      it('should decrement health when slide result is fail', function(){
        var view = generateRunnerView();
        view.render();
        var healthModel = view.model.get('health');
        var deckModel = view.model.get('deck');
        deckModel.getCurrentSlideModel().set('result', 'fail');
        var expectedHealth = healthModel.get('size') - 1;
        var actualHealth = healthModel.get('currentHealth');
        expect(expectedHealth).toEqual(actualHealth);
        view.remove();
      });

      it('should not decrement health when slide result is pass', function(){
        var view = generateRunnerView();
        view.render();
        var healthModel = view.model.get('health');
        var deckModel = view.model.get('deck');
        deckModel.getCurrentSlideModel().set('result', 'pass');
        var expectedHealth = healthModel.get('size');
        var actualHealth = healthModel.get('currentHealth');
        expect(expectedHealth).toEqual(actualHealth);
        view.remove();
      });

      it('should increment progress when slide changes', function(){
        var view = generateRunnerView();
        view.render();
        var progressModel = view.model.get('progress');
        var deckView = view.body.currentView;

        var advanceAndCheckProgress = function(){
          deckView.goToNextSlide();
          var expectedProgress = deckView.model.get('currentSlideIndex');
          var actualProgress = progressModel.get('currentProgress');
          expect(expectedProgress).toEqual(actualProgress);
        }

        for (var i=0; i < 2; i++){
          advanceAndCheckProgress();
        }

        view.remove();
      });

      it('should fail deck when health is empty', function(){
        var view = generateRunnerView();
        view.render();

        var failed = null;

        view.model.on('change:result', function(model){
          failed = (model.get('result') == 'fail');
        });

        var healthModel = view.model.get('health');
        healthModel.trigger('empty');

        expect(failed).toBe(true);
        view.remove();
      });

    });

    describe('after deck completes', function(){

      it('should pass deck if we get to the end and still have health', function(){
        var view = generateRunnerView();
        view.render();

        var passed = null;

        view.model.on('change:result', function(model){
          passed = (model.get('result') == 'pass');
        });

        view.trigger('deck:completed');

        expect(passed).toBe(true);
        view.remove();
      });

      it('should show an outro view if one was given', function(){
        var outroView = new SillyView({
          model: new Backbone.Model({id: 'outro'})
        });
        var view = generateRunnerView({
          getOutroView: function(){
            return outroView;
          }
        });
        view.render();

        view.trigger('deck:completed');

        expect(view.body.currentView.model.get('id')).toEqual('outro');
        view.remove();
      });

      it('should do nothing if no outro view was given', function(){
        var view = generateRunnerView();
        view.render();
        view.trigger('deck:completed');

        var deckModel = view.model.get('deck');
        expect(view.body.currentView.model).toBe(deckModel);
        view.remove();
      });

    });
    
    describe('update navigation for slide ', function(){

      var getNavView = function(runnerView){
        return runnerView.nav.currentView;
      };

      var getNavButtons = function(runnerView){
        var navView = getNavView(runnerView);
        return navView.$el.find('button');
      };

      var getCurrentSlideView = function(runnerView){
        return runnerView.body.currentView.slide.currentView;
      };

      var verifyButtons = function(runnerView, buttonSpecs){
        var $navButtons = getNavButtons(runnerView);
        expect($navButtons.length).toBe(buttonSpecs.length);
        _.each(buttonSpecs, function(buttonSpec, idx){
          var $button = $navButtons.eq(idx);
          expect($button.html()).toContain(buttonSpec.label);
          expect($button.attr('disabled')).toBe(buttonSpec.disabled);
        });
      };

      describe('submissionType: manual', function(){

        var runnerView;
        var currentSlideView;
        beforeEach(function(){
          runnerView = generateRunnerView();
          var slides = runnerView.model.get('deck').get('slides');
          slides.each(function(slideModel){
            slideModel.set('submissionType', 'manual');
          });
          runnerView.render();
          currentSlideView = getCurrentSlideView(runnerView);
        });

        afterEach(function(){
          runnerView.remove();
        });

        describe('when slide is shown', function(){
          it('should have only have disabled "check" button', function(){
            verifyButtons(runnerView, [
              {label: 'check', disabled: 'disabled'}
            ]);
          });
        });

        describe('when submission has been entered', function(){

          beforeEach(function(){
            currentSlideView.model.set('submission', 42);
          });

          it("should have active check button", function(){
            verifyButtons(runnerView, [
              {label: 'check', disabled: undefined}
            ]);
          });

          it("check button should be disabled if submission is removed", function(){
            currentSlideView.model.set('submission', undefined);
            verifyButtons(runnerView, [
              {label: 'check', disabled: 'disabled'}
            ]);
          });
        });

        describe("after submission has been submitted, before result received", function(){
          beforeEach(function(){
            currentSlideView.model.set('submission', 42);
            currentSlideView.model.set('submissionStatus', 'submitting');
          });

          it("should have 'disabled checking' for button text", function(){
            verifyButtons(runnerView, [
              {label: 'checking', disabled: 'disabled'}
            ]);
          });
        });

        describe("after submission is complete", function(){
          beforeEach(function(){
            currentSlideView.model.set('submission', 42);
            currentSlideView.model.set('submissionStatus', 'completed');
          });
          it("should have enabled 'continue' button", function(){
            verifyButtons(runnerView, [
              {label: 'continue', disabled: undefined}
            ]);
          });
        });
      });

      describe('submissionType: automatic', function(){

        describe('when slide is shown', function(){
          it('should have disabled "check" button', function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after answer has been submitted, before result received", function(){
          it("should have disabled 'checking' button", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after result received", function(){
          it("should have enabled 'continue' button", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

      });

      describe('submissionType: noSubmission', function(){
        it('should have an enabled "continue" button', function(){
          this.fail('NOT IMPLEMENTED');
        });
      });
    });
  });
});

