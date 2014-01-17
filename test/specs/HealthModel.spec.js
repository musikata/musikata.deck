define(
  [
  'deck/HealthModel',
],
function(
  HealthModel
){

  ddescribe('HealthModel', function(){

    it('should be defined', function(){
      expect(HealthModel).toBeDefined();
    });

    describe('default attributes', function(){

      var model;

      beforeEach(function(){
        model = new HealthModel();
      });

      it('should have a size attribute', function(){
        expect(model.get('size')).toBeDefined();
      });

      it('should have a currentHealth attribute', function(){
        expect(model.get('currentHealth')).toBeDefined();
      });

    });

  });

});
