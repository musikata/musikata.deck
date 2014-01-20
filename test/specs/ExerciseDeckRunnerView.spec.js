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
  var DummyIntroView = Marionette.ItemView.extend({
    template: Handlebars.compile('<div>Da Intro</div>')
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

  var generateRunnerView = function(){
    var testModels = generateTestModels();
    var runnerView = new ExerciseDeckRunnerView({
      model: testModels.runner,
      viewFactory: generateViewFactory()
    });
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

    describe('before deck starts', function(){
      it('should show an intro view if one was provided', function(){
        var deckRunner = new ExerciseDeckRunner({
          getIntroView: function(){
            return new DummyIntroView({
              model: new Backbone.Model({id: 'intro'})
            });
          },
          getDeckView: function(){
            deckView: generateRunnerView()
          }
        });
        deckRunner.render();
        expect(deckRunner.body.currentView.model.get('id')).toEqual('intro');
      });

      it('should show the first slide if no intro view was given', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should show the first slide when the intro view completes', function(){
        this.fail('NOT IMPLEMENTED');
      });
    });

    describe('after deck completes ', function(){
      it('should show an outro view if one was given', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should do nothing if no outro view was given', function(){
        this.fail('NOT IMPLEMENTED');
      });

    });
  });
});

