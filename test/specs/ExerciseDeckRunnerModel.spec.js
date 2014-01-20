define(function(require){

  var ExerciseDeckRunnerModel = require('deck/ExerciseDeckRunnerModel');
  var HealthModel = require('deck/HealthModel');

  describe('ExerciseDeckRunnerModel', function(){

    it('should be defined', function(){
      expect(ExerciseDeckRunnerModel).toBeDefined();
    });

    describe('default attributes', function(){

      var model;

      beforeEach(function(){
        model = new ExerciseDeckRunnerModel();
      });

      it('should have a health attribute', function(){
        var health = model.get('health');
        expect(health instanceof HealthModel).toBe(true);
      });

      it('should have a result attribute', function(){
        expect(model.get('result')).toBeDefined();
      });

    });

  });

});
