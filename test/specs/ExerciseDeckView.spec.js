define(
  [
  'underscore',
  './DeckViewCommon',
  'deck/ExerciseDeckModel',
  'deck/ExerciseDeckView',
  'deck/ViewFactory',
],
function(
  _, 
  DeckViewCommon,
  ExerciseDeckModel,
  ExerciseDeckView, 
  ViewFactory
){

  describe('ExerciseDeckView', function(){

    it('should be defined', function(){
      expect(ExerciseDeckView).toBeDefined();
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
    }

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
      testModels.deck = new ExerciseDeckModel({slides: testModels.slides});

      return testModels;
    };

    var generateDeckView = function(){
      var testModels = generateTestModels();
      var deckView = new ExerciseDeckView({
        model: testModels.deck,
        viewFactory: generateViewFactory()
      });
      return deckView;
    };

    // Run common deck view tests.
    DeckViewCommon.testDeckView({
      DeckView: ExerciseDeckView,
      generateViewFactory: generateViewFactory,
      generateTestModels: generateTestModels
    });

    it('should display health', function(){
      var view = generateDeckView();
      view.render();
      expect(view.$el.find('.health').length).toEqual(1);
      expect(view.$el.find('.health_unit').length).toBeGreaterThan(0);
      view.remove();
    });

    it('should decrement health when slide result is fail', function(){
      var view = generateDeckView();
      view.render();
      var healthModel = view.model.get('health');
      view.slide.currentView.model.set('result', 'fail');
      var expectedHealth = healthModel.get('size') - 1;
      var actualHealth = healthModel.get('currentHealth');
      expect(expectedHealth).toEqual(actualHealth);
      view.remove();
    });

    it('should not decrement health when slide result is pass', function(){
      var view = generateDeckView();
      view.render();
      var healthModel = view.model.get('health');
      view.slide.currentView.model.set('result', 'pass');
      var expectedHealth = healthModel.get('size');
      var actualHealth = healthModel.get('currentHealth');
      expect(expectedHealth).toEqual(actualHealth);
      view.remove();
    });

    it('should fail deck when health is empty', function(){
      var view = generateDeckView();
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
      var view = generateDeckView();
      view.render();

      var passed = null;

      view.model.on('change:result', function(model){
        passed = (model.get('result') == 'pass');
      });

      view.trigger('deck:completed');

      expect(passed).toBe(true);
      view.remove();
    });

  });

});
