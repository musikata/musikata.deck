define(function(require){
  var ExerciseDeckViewCommon = require('./ExerciseDeckViewCommon');
  var DeckViewCommon = require('./DeckViewCommon');
  var ExerciseDeckView = require('deck/ExerciseDeckView');

  describe('ExerciseDeckView', function(){

    it('should be defined', function(){
      expect(ExerciseDeckView).toBeDefined();
    });


    // Run common deck view tests.
    DeckViewCommon.testDeckView({
      DeckView: ExerciseDeckView,
      generateViewFactory: ExerciseDeckViewCommon.generateViewFactory,
      generateTestModels: ExerciseDeckViewCommon.generateTestModels
    });

    it('should display health', function(){
      var view = ExerciseDeckViewCommon.generateDeckView();
      view.render();
      expect(view.$el.find('.health').length).toEqual(1);
      expect(view.$el.find('.health_unit').length).toBeGreaterThan(0);
      view.remove();
    });

    it('should decrement health when slide result is fail', function(){
      var view = ExerciseDeckViewCommon.generateDeckView();
      view.render();
      var healthModel = view.model.get('health');
      view.slide.currentView.model.set('result', 'fail');
      var expectedHealth = healthModel.get('size') - 1;
      var actualHealth = healthModel.get('currentHealth');
      expect(expectedHealth).toEqual(actualHealth);
      view.remove();
    });

    it('should not decrement health when slide result is pass', function(){
      var view = ExerciseDeckViewCommon.generateDeckView();
      view.render();
      var healthModel = view.model.get('health');
      view.slide.currentView.model.set('result', 'pass');
      var expectedHealth = healthModel.get('size');
      var actualHealth = healthModel.get('currentHealth');
      expect(expectedHealth).toEqual(actualHealth);
      view.remove();
    });

    it('should fail deck when health is empty', function(){
      var view = ExerciseDeckViewCommon.generateDeckView();
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
      var view = ExerciseDeckViewCommon.generateDeckView();
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
