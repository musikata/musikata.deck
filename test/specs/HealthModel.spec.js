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

      it('decrementCurrentHealth shoudld reduce currentHealth by default or x', function(){
        var model = new HealthModel({
          size: 3
        });
        model.decrementCurrentHealth();
        expect(model.get('currentHealth')).toEqual(2);
        model.decrementCurrentHealth(2);
        expect(model.get('currentHealth')).toEqual(0);
      });

      it("should trigger 'empty' when currentHealth is 0", function(){
        var model = new HealthModel({
          size: 3
        });
        var emptySpy = jasmine.createSpy('emptySpy');
        model.on('empty', emptySpy);
        model.set('currentHealth', 0);
        expect(emptySpy).toHaveBeenCalled();
      });

    });

  });

});
