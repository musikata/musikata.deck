define(
  [
  'deck/HealthModel',
],
function(
  HealthModel
){

  describe('HealthModel', function(){

    it('should be defined', function(){
      expect(HealthModel).toBeDefined();
    });

    describe('default attributes', function(){

      it('should have a size attribute', function(){
        var model = new HealthModel();
        expect(model.get('size')).toBeDefined();
      });

      it('should have a currentHealth attribute', function(){
        var model = new HealthModel();
        expect(model.get('currentHealth')).toBeDefined();
      });

      it('currentHealth should default to size if not set', function(){
        var model = new HealthModel({
          size: 3
        });
        expect(model.get('currentHealth')).toEqual(3);
      });

    });

  });

});
