define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ViewFactory = require('deck/ViewFactory');
  var SlideModel = require('deck/SlideModel');
  var ExerciseSlideModel = require('deck/ExerciseSlideModel');
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
    viewFactory.addHandler('silly', function(options){
      return new SillyExercise(options)
    });
    viewFactory.addHandler('html', function(options){
      return new HtmlView(options);
    });
    return viewFactory;
  };

  var generateDeckModel = function(overrides){
    var opts = _.extend({
      numSlides: 3,
      generateSlideModel: function(idx){
        return new SlideModel({
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
      numSlides: 4,
      destination: '/foo'
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    testModels.introDeck = generateDeckModel();

    testModels.exerciseDeck = generateDeckModel({
      generateSlideModel: function(idx){
        return new ExerciseSlideModel({id: idx, type: 'silly'});
      }
    });

    testModels.runnerModel = new MusikataExerciseRunnerModel({
      introDeck: testModels.introDeck,
      exerciseDeck: testModels.exerciseDeck,
      destination: mergedOptions.destination
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

  var clickThroughIntroSlides = function(runnerView){
    var introSlides = runnerView.model.get('introDeck').get('slides');
    var $continueButton = getNavButton(runnerView, 'continue');
    for (var i=0; i < introSlides.length - 1; i++){
      $continueButton.trigger('click');
    }
    var $startButton = getNavButton(runnerView, 'start');
    $startButton.trigger('click');
  };

  var getNavView = function(runnerView){
    return runnerView.nav.currentView;
  };

  var getNavButtons = function(runnerView){
    var navView = getNavView(runnerView);
    return navView.$el.find('button');
  };

  var getNavButton = function(runnerView, buttonText){
    var navView = getNavView(runnerView);
    return navView.$el.find('button:contains("' + buttonText + '")');
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
          expect(progressModel.get('currentProgress')).toBe(i + 1);
          primaryDeckView.goToNextSlide();
        }
        this.after(function(){runnerView.remove()});
      });
    });

    describe('outro view', function(){
      var runnerView;
      beforeEach(function(){
        runnerView =  generateRunnerView();
        runnerView.render();
      });

      afterEach(function(){
        runnerView.remove();
      });

      it('should show outro view when deck completion event fires', function(){
        var outroSpy = jasmine.createSpy('show outro view');
        runnerView.on('show:outroView', function(){
          outroSpy();
        });
        clickThroughIntroSlides(runnerView);
        var primaryDeckView = runnerView.body.currentView;
        primaryDeckView.trigger('deck:completed');
        expect(outroSpy).toHaveBeenCalled();
      });

      describe("when result is 'pass'", function(){

        beforeEach(function(){
          runnerView.model.set('result', 'pass');
          runnerView.showOutroView();
        });

        it("should show 'pass' outro view", function(){
          expect(runnerView.body.currentView.type).toBe('PassView');
        });

        it("should show enabled 'continue' button in nav", function(){
          verifyButtons(runnerView, [
            {label: 'continue', disabled: undefined}
          ]);
        });

        it("clicking 'continue' button should trigger navigate", function(){
          var navigationSpy = jasmine.createSpy('navigate');
          runnerView.on('navigate', function(destination){
            navigationSpy(destination);
          });
          var $continueButton = getNavButton(runnerView, 'continue');
          $continueButton.trigger('click');
          expect(navigationSpy).toHaveBeenCalledWith('destination');
        });
      });

      describe("when result is 'fail'", function(){

        beforeEach(function(){
          runnerView.model.set('result', 'fail');
          runnerView.showOutroView();
        });

        it("should show 'fail' outro view", function(){
          expect(runnerView.body.currentView.type).toBe('FailView');
        });

        it("should show correct buttons in nav", function(){
          verifyButtons(runnerView, [
            {label: 'leave feedback', disabled: undefined},
            {label: 'return to dojo', disabled: undefined},
            {label: 'try again', disabled: undefined}
          ]);
        });

        it("clicking 'leave feedback' should trigger navigate", function(){
          var navigationSpy = jasmine.createSpy('navigationSpy');
          runnerView.on('navigate', navigationSpy);
          var $feedbackButton = getNavButton(runnerView, 'leave feedback');
          $feedbackButton.trigger('click');
          expect(navigationSpy).toHaveBeenCalledWith('feedback');
        });

        it("clicking 'return to dojo' should trigger navigate", function(){
          var navigationSpy = jasmine.createSpy('navigationSpy');
          runnerView.on('navigate', navigationSpy);
          var $dojoButton = getNavButton(runnerView, 'return to dojo');
          $dojoButton.trigger('click');
          expect(navigationSpy).toHaveBeenCalledWith('dojo');
        });

        it("clicking 'try again' should trigger navigate", function(){
          var navigationSpy = jasmine.createSpy('navigationSpy');
          runnerView.on('navigate', navigationSpy);
          var $reloadButton = getNavButton(runnerView, 'try again');
          $reloadButton.trigger('click');
          expect(navigationSpy).toHaveBeenCalledWith('tryAgain');
        });

      });
    });

  });

});
