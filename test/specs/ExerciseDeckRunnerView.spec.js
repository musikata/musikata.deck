define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ViewFactory = require('deck/ViewFactory');
  var DeckModel = require('deck/DeckModel');
  var DeckView = require('deck/DeckView');
  var ExerciseSlideModel = require('deck/ExerciseSlideModel');
  var ExerciseDeckRunnerModel = require('deck/ExerciseDeckRunnerModel');
  var ExerciseDeckRunnerView = require('deck/ExerciseDeckRunnerView');

  // Define a dummy intro view.
  var SillyView = Marionette.ItemView.extend({
    template: Handlebars.compile('<div>Beans!</div>')
  });

  // Define a test exercise.
  var SillyExercise = Marionette.ItemView.extend({
    submissionType: 'automatic',
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
      this.submission.set('result', passFail);
    }
  });

  /*
   * Define generator functions.
   */

  var generateViewFactory = function(){
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('silly', function(options){
      return new SillyExercise(options);
    });
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
      slideModels.push(new ExerciseSlideModel({type: 'silly'}));
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

    describe('progress view', function(){
      var view;
      beforeEach(function(){
      });

      it('should be visible', function(){
        view = generateRunnerView();
        view.render();
        $('body').append(view.$el);
        expect(view.progress.$el.is(':visible')).toBe(true);
      });

      it('should have correct number of progress units', function(){
        _.each([5, 1, 7], function(numSlides){
          var testModels = generateTestModels({numSlides: numSlides});
          view = generateRunnerView({model: testModels.runner});
          view.render();
          $('body').append(view.$el);
          var $progressUnits = view.progress.currentView.ui.progressUnits;
          expect($progressUnits.length).toBe(numSlides);
          view.remove();
        });
      });
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
      var view;
      var deckView;
      var currentSlideView;
      var currentSubmission;
      var healthModel;
      beforeEach(function(){
        view = generateRunnerView();
        view.render();
        deckView = view.body.currentView;
        currentSlideView = deckView.slide.currentView;
        currentSubmission = currentSlideView.model.get('submission');
        healthModel = view.model.get('health');
      });

      afterEach(function(){
        view.remove();
      });

      it('should route nav button events to the deck', function(){
        var clickSpy = jasmine.createSpy('clickSpy');
        deckView.on('fakeClick', clickSpy);
        view.nav.currentView.trigger('button:clicked', {}, 'fakeClick');
        expect(clickSpy).toHaveBeenCalled();
      });

      it('should decrement health when slide result is fail', function(){
        currentSubmission.set('result', 'fail');
        var expectedHealth = healthModel.get('size') - 1;
        var actualHealth = healthModel.get('currentHealth');
        expect(expectedHealth).toEqual(actualHealth);
      });

      it('should not decrement health when slide result is pass', function(){
        currentSubmission.set('result', 'pass');
        var expectedHealth = healthModel.get('size');
        var actualHealth = healthModel.get('currentHealth');
        expect(expectedHealth).toEqual(actualHealth);
      });

      it('should increment progress when slide changes', function(){
        var view = generateRunnerView();
        view.render();
        var progressModel = view.model.get('progress');
        var deckView = view.body.currentView;

        var advanceAndCheckProgress = function(){
          deckView.goToNextSlide();
          var expectedProgress = deckView.model.get('currentSlideIndex') + 1;
          var actualProgress = progressModel.get('currentProgress');
          expect(expectedProgress).toEqual(actualProgress);
        }

        for (var i=0; i < 2; i++){
          advanceAndCheckProgress();
        }
      });

      describe('when health is empty', function(){
        beforeEach(function(){
          view.model.get('health').set('currentHealth', 0);
        });

        it('should trigger deck:complete on next continue event', function(){
          var completionSpy = jasmine.createSpy('completionSpy');
          view.on('primaryDeck:completed', completionSpy);
          view.navView.trigger('button:clicked', {}, 'continue');
          expect(completionSpy).toHaveBeenCalled();
        })

      });

    });

    describe('after primary deck completes', function(){

      var view;
      beforeEach(function(){
        view = generateRunnerView();
        view.render();
      });

      afterEach(function(){
        view.remove();
      });

      it('should pass deck if we still have health', function(){
        view.trigger('primaryDeck:completed');
        expect(view.model.get('result')).toBe('pass');
      });

      it('should fail deck if we are out of health', function(){
        view.model.get('health').set('currentHealth', 0);
        view.trigger('primaryDeck:completed');
        expect(view.model.get('result')).toBe('fail');
      });

      it('should trigger submit event on runner', function(){
        var submitSpy = jasmine.createSpy('submit');
        view.on('submit', submitSpy);
        view.trigger('primaryDeck:completed');
        expect(submitSpy).toHaveBeenCalled();
      });


    });

    describe('outro view', function(){
      var view;
      afterEach(function(){
        view.remove();
      });

      it('should show an outro view if one was given', function(){
        var outroView = new SillyView({
          model: new Backbone.Model({id: 'outro'})
        });
        view = generateRunnerView({
          getOutroView: function(){
            return outroView;
          }
        });
        view.render();

        view.showOutroView();
        expect(view.body.currentView.model.get('id')).toEqual('outro');
      });

      it('should do nothing if no outro view was given', function(){
        view = generateRunnerView();
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

      describe("submissions", function(){
        var SubmittingExercise = Marionette.ItemView.extend({
          template: function(){return '';},
        });

        describe('submissionType: manual', function(){
          var ManualExercise = SubmittingExercise.extend({
            submissionType: 'manual'
          });
          var runnerView;
          var currentSlideView;
          var submission;

          beforeEach(function(){
            runnerView = generateRunnerView();
            runnerView.options.viewFactory.setHandler('silly', function(opts){
              return new ManualExercise(opts);
            });
            runnerView.render();
            currentSlideView = getCurrentSlideView(runnerView);
            submission = currentSlideView.model.get('submission');
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
              submission.set('data', 42);
            });

            it("should have active check button", function(){
              verifyButtons(runnerView, [
                {label: 'check', disabled: undefined}
              ]);
            });

            it("check button should be disabled if submission is removed", function(){
              submission.set('data', undefined);
              verifyButtons(runnerView, [
                {label: 'check', disabled: 'disabled'}
              ]);
            });
          });

          describe("after submission has been submitted, before result received", function(){
            beforeEach(function(){
              submission.set('data', 42);
              submission.set('state', 'submitting');
            });

            it("should have 'disabled checking' for button text", function(){
              verifyButtons(runnerView, [
                {label: 'checking', disabled: 'disabled'}
              ]);
            });
          });

          describe("after submission is complete", function(){
            beforeEach(function(){
              submission.set('data', 42);
              submission.set('state', 'completed');
            });

            it("should have enabled 'continue' button", function(){
              verifyButtons(runnerView, [
                {label: 'continue', disabled: undefined}
              ]);
            });
          });
        });

        describe('submissionType: automatic', function(){
          var AutomaticExercise = SubmittingExercise.extend({
            submissionType: 'automatic'
          });
          var runnerView;
          var currentSlideView;
          var submission;
          beforeEach(function(){
            runnerView = generateRunnerView();
            runnerView.options.viewFactory.setHandler('silly', function(opts){
              return new AutomaticExercise(opts);
            });
            runnerView.render();
            currentSlideView = getCurrentSlideView(runnerView);
            submission = currentSlideView.model.get('submission');
          });

          afterEach(function(){
            runnerView.remove();
          });

          describe('when slide is shown', function(){
            it('should have blank disabled button', function(){
              verifyButtons(runnerView, [
                {label: '&nbsp;', disabled: 'disabled'}
              ]);
            });
          });

          describe("after submission has been submitted, before result received", function(){
            beforeEach(function(){
              submission.set('data', 42);
              submission.set('state', 'submitting');
            });

            it("should have disabled 'checking' button", function(){
              verifyButtons(runnerView, [
                {label: 'checking', disabled: 'disabled'}
              ]);
            });
          });

          describe("after result received", function(){
            beforeEach(function(){
              submission.set('data', 42);
              submission.set('state', 'completed');
            });

            it("should have enabled 'continue' button", function(){
              verifyButtons(runnerView, [
                {label: 'continue', disabled: undefined}
              ]);
            });
          });

        });

        describe('submissionType: noSubmission', function(){
          var NoSubmissionExercise = SubmittingExercise.extend({
            submissionType: null
          });
          var runnerView;
          var currentSlideView;
          var submission;

          beforeEach(function(){
            runnerView = generateRunnerView();
            runnerView.options.viewFactory.setHandler('silly', function(opts){
              return new NoSubmissionExercise(opts);
            });
            runnerView.render();
            currentSlideView = getCurrentSlideView(runnerView);
            submission = currentSlideView.submission;
          });

          afterEach(function(){
            runnerView.remove();
          });

          it('should have an enabled "continue" button', function(){
            verifyButtons(runnerView, [
              {label: 'continue', disabled: undefined}
            ]);
          });
        });
      });
    });
  });
});

