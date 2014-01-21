define(function(require){

  var MusikataExerciseRunnerModel = require('deck/MusikataExerciseRunnerModel');
  var HealthModel = require('deck/HealthModel');

  describe('MusikataExerciseRunnerModel', function(){

    it('should be defined', function(){
      expect(MusikataExerciseRunnerModel).toBeDefined();
    });

    describe('default attributes', function(){

      var model;

      beforeEach(function(){
        model = new MusikataExerciseRunnerModel();
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
