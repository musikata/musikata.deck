define(
  [
  'underscore',
  'deck/ExerciseDeckModel',
  'deck/ExerciseDeckView',
  'deck/ViewFactory',
],
function(
  _, 
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

    // Setup viewFactory.
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('silly', SillyExercise);

    var createTestModels = function(options){
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

    var generateExerciseDeckView = function(){
      var testModels = createTestModels();

      var view = new ExerciseDeckView({
        model: testModels.deck,
        viewFactory: viewFactory
      });

      return view;
    };

    it('should display health', function(){
      var view = generateExerciseDeckView();
      view.render();
      expect(view.$el.find('.health').length).toEqual(1);
      expect(view.$el.find('.health_unit').length).toBeGreaterThan(0);
      view.remove();
    });

    it('should decrement current health when slide result is fail', function(){
      var view = generateExerciseDeckView();
      var healthModel = view.model.get('health');
      view.render();
      view.slide.view.model.set('result', 'fail');
      var expectedHealth = healthModel.get('size') - 1;
      var actualHealth = healthModel.get('currentHealth');
      expect(expectedHealth).toEqual(actualHealth);
      view.remove();
    });

    it('should advance slide when slide result is pass', function(){
      this.fail('TODO');
    });

    it('should fail deck when health is gone', function(){
      this.fail('TODO');
    });

    it('should pass deck if we get to the end and still have health', function(){
      this.fail('TODO');
    });

  });

});
