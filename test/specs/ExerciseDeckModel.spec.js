define(
  [
    'require',
    'deck/ExerciseDeckModel',
    'deck/HealthModel',
], function(require, ExerciseDeckModel, HealthModel){

  describe('ExerciseDeckModel', function(){

    it('should be defined', function(){
      expect(ExerciseDeckModel).toBeDefined();
    });

    describe('default attributes', function(){

      var model;

      beforeEach(function(){
        model = new ExerciseDeckModel();
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
