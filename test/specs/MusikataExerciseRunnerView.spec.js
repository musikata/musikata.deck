define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ViewFactory = require('deck/ViewFactory');
  var DeckModel = require('deck/DeckModel');
  var DeckView = require('deck/DeckView');
  var HtmlView = require('deck/HtmlView');
  var MusikataExerciseRunnerModel = require('deck/MusikataExerciseRunnerModel');
  var MusikataExerciseRunnerView = require('deck/MusikataExerciseRunnerView');

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
    viewFactory.addHandler('html', HtmlView);
    return viewFactory;
  };

  var generateDeckModel = function(overrides){
    var opts = _.extend({
      numSlides: 3,
      generateSlideModel: function(idx){
        return new Backbone.Model({
          id: idx,
          type: 'html',
          html: '<span>slide #' + idx + '</span>'
        });
      }
    }, overrides);

    var slideModels = [];
    for(var i=0; i < opts.numSlides; i++){
      slideModels.push(opts.generateSlideModel(i));
    }
    var slidesCollection = new Backbone.Collection(slideModels);
    var deckModel = new DeckModel({
      slides: slidesCollection
    }, {parse: true});

    return deckModel;
  };

  var generateTestModels = function(options){
    var defaultOptions = {
      numSlides: 4
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    testModels.introDeck = generateDeckModel();

    testModels.exerciseDeck = generateDeckModel({
      generateSlideModel: function(idx){
        return new Backbone.Model({id: idx, type: 'silly'});
      }
    });

    testModels.runnerModel = new MusikataExerciseRunnerModel({
      introDeck: testModels.introDeck,
      exerciseDeck: testModels.exerciseDeck
    });

    return testModels;
  };

  var generateRunnerView = function(overrides){

    var opts = _.extend({
      model: generateTestModels().runnerModel,
      getOutroView: null,
      viewFactory: generateViewFactory()
    }, overrides);

    var runnerView = new MusikataExerciseRunnerView(opts);

    return runnerView;
  };

  /*
   * Utility methods.
   */
  var getNavButton = function(runnerView, buttonText){
    var navView = runnerView.nav.currentView;
    return navView.$el.find('button:contains("' + buttonText + '")');
  };

  var clickThroughIntroSlides = function(runnerView){
    var introSlides = runnerView.model.get('introDeck').get('slides');
    var $continueButton = getNavButton(runnerView, 'continue');
    for (var i=0; i < introSlides.length - 1; i++){
      $continueButton.trigger('click');
    }
    var $startButton = getNavButton(runnerView, 'start');
    $startButton.trigger('click');
  };

  describe('MusikataExerciseRunnerView', function(){
    it('should be defined', function(){
      expect(MusikataExerciseRunnerView).toBeDefined();
    });

    describe('intro slides', function(){

      it('should show intro slides if provided', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        var bodyView = runnerView.body.currentView;
        var introSlides = runnerView.model.get('introDeck').get('slides');
        expect(bodyView.model.get('slides')).toBe(introSlides);
        this.after(function(){runnerView.remove()});
      });

      it('should show correct navigation for intro slides', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        var $continueButton = getNavButton(runnerView, 'continue');
        expect($continueButton.length).toBe(1);
        expect($continueButton.attr('disabled')).toBeUndefined();
        this.after(function(){runnerView.remove()});
      });

      it('should advance through intro slides w/out changing progress bar', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        var introView = runnerView.body.currentView;
        var progressView = runnerView.progress.currentView;
        var $continueButton = getNavButton(runnerView, 'continue');
        $continueButton.trigger('click');
        expect(introView.$el.html()).toContain('slide #1');
        expect(progressView.model.get('currentProgress')).toBe(0);

        this.after(function(){runnerView.remove()});
      });

      it('should change nav to "start" on last intro slide', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        var $continueButton = getNavButton(runnerView, 'continue');
        var introSlides = runnerView.model.get('introDeck').get('slides');
        for (var i=0; i < introSlides.length - 1; i++){
          $continueButton.trigger('click');
        }
        var $startButton = getNavButton(runnerView, 'start');
        expect($startButton.length).toBe(1);
        this.after(function(){runnerView.remove()});
      });

      it('nav should be "start" if only one intro slide', function(){
        var runnerView =  generateRunnerView();
        var introSlides = runnerView.model.get('introDeck').get('slides');
        while( introSlides.length > 1){
          introSlides.pop();
        }
        runnerView.render();
        var $startButton = getNavButton(runnerView, 'start');
        expect($startButton.length).toBe(1);
        this.after(function(){runnerView.remove()});
      });

    });

    describe('exercise slides', function(){

      it('should start showing exercise slides when intro slides are done', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        clickThroughIntroSlides(runnerView);
        var bodyView = runnerView.body.currentView;
        expect(bodyView.model.cid).toBe(runnerView.model.get('exerciseDeck').cid);
        this.after(function(){runnerView.remove()});
      });

      it('should start showing exercise slides if there were no intro slides', function(){
        var runnerView =  generateRunnerView();
        var introSlides = runnerView.model.get('introDeck').get('slides');
        introSlides.reset();
        runnerView.render();
        var bodyView = runnerView.body.currentView;
        expect(bodyView.model.cid).toBe(runnerView.model.get('exerciseDeck').cid);
        this.after(function(){runnerView.remove()});
      });

      it('should update navigation for each exercise slides', function(){
        var runnerView =  generateRunnerView();
        spyOn(runnerView, 'updateNavForSlide');
        runnerView.render();
        clickThroughIntroSlides(runnerView);
        var primaryDeckView = runnerView.body.currentView;
        var numExerciseSlides = primaryDeckView.model.get('slides').length;
        for (var i=0; i < numExerciseSlides - 1; i++){
          primaryDeckView.goToNextSlide();
        }
        expect(runnerView.updateNavForSlide.callCount).toBe(numExerciseSlides);

        this.after(function(){runnerView.remove()});
      });

      it('should change progress bar when going through exercise slides', function(){
        var runnerView =  generateRunnerView();
        spyOn(runnerView, 'updateNavForSlide');
        runnerView.render();
        clickThroughIntroSlides(runnerView);
        var primaryDeckView = runnerView.body.currentView;
        var progressModel = runnerView.progress.currentView.model;
        var numExerciseSlides = primaryDeckView.model.get('slides').length;
        for (var i=0; i < numExerciseSlides - 1; i++){
          primaryDeckView.goToNextSlide();
          expect(progressModel.get('currentProgress')).toBe(i + 1);
        }
        this.after(function(){runnerView.remove()});
      });
    });

    describe('outro view', function(){
      it('should show outro view when deck completion event fires', function(){
        var outroSpy = jasmine.createSpy('show outro view');
        var runnerView =  generateRunnerView();
        runnerView.on('show:outroView', function(){
          outroSpy();
        });
        runnerView.render();
        clickThroughIntroSlides(runnerView);
        var primaryDeckView = runnerView.body.currentView;
        primaryDeckView.trigger('deck:completed');
        expect(outroSpy).toHaveBeenCalled();
        this.after(function(){runnerView.remove()});
      });

      it("should show 'try again' view if runner result was 'fail'", function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        runnerView.model.set('result', 'fail');
        runnerView.showOutroView();
        expect(runnerView.body.currentView.type).toBe('FailView');
        this.after(function(){runnerView.remove()});
      });

      it("should show 'pass' view if runner result was 'pass' and we're not a milestone", function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        runnerView.model.set('result', 'pass');
        runnerView.showOutroView();
        expect(runnerView.body.currentView.type).toBe('PassView');
        this.after(function(){runnerView.remove()});
      });

      it("should show milestone 'pass' view if runner result was 'pass' and we're a milestone", function(){
        var runnerView =  generateRunnerView();
        runnerView.model.set("milestone", true);
        runnerView.render();
        runnerView.model.set('result', 'pass');
        runnerView.showOutroView();
        expect(runnerView.body.currentView.type).toBe('MilestonePassView');
        this.after(function(){runnerView.remove()});
      });
    });

    describe('navigation coordination', function(){

      describe('manual submission', function(){

        describe('when slide is shown', function(){
          it('should have "check" button', function(){
            this.fail('NOT IMPLEMENTED');
          });

          it('"check" button should be disabled', function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe('when answer has been entered', function(){
          it("should have active check button", function(){
            this.fail('NOT IMPLEMENTED');
          });

          it("check button should be disabled if answer is removed", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after answer has been submitted, before result received", function(){
          it("should have 'checking' for button text", function(){
            this.fail('NOT IMPLEMENTED');
          });

          it("button should be disabled", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after result received", function(){
          it("should have 'continue' for button text", function(){
            this.fail('NOT IMPLEMENTED');
          });

          it("button should be enabled", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });
      });

      describe('automatic submission', function(){

        describe('when slide is shown', function(){
          it('should have "check" button', function(){
            this.fail('NOT IMPLEMENTED');
          });

          it('button should be disabled', function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after answer has been submitted, before result received", function(){
          it("should have 'checking' for button text", function(){
            this.fail('NOT IMPLEMENTED');
          });

          it("button should be disabled", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

        describe("after result received", function(){
          it("should have 'continue' for button text", function(){
            this.fail('NOT IMPLEMENTED');
          });

          it("button should be enabled", function(){
            this.fail('NOT IMPLEMENTED');
          });
        });

      });

      describe('no submission', function(){
        it('should have only a "continue" button', function(){
          this.fail('NOT IMPLEMENTED');
        });

        it('"continue" button should be enabled', function(){
          this.fail('NOT IMPLEMENTED');
        });
      });
    });
  });

});
