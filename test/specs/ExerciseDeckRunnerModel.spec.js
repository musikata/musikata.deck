define(function(require){

  var ExerciseDeckRunnerModel = require('deck/ExerciseDeckRunnerModel');
  var HealthModel = require('deck/HealthModel');
  var ProgressModel = require('deck/ProgressModel');

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

      it('should have a progress attribute', function(){
        var progress = model.get('progress');
        expect(progress instanceof ProgressModel).toBe(true);
      });

      it('should have a result attribute', function(){
        expect(model.get('result')).toBeDefined();
      });

    });

  });

});
