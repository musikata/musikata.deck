define(
  [
    'require',
    'underscore',
    'deck/ExerciseDeckModel',
    'deck/ExerciseDeckView',
    'deck/ViewFactory'
],
function(require, _, ExerciseDeckModel, ExerciseDeckView, ViewFactory){

  // Setup viewFactory.
  var viewFactory = new ViewFactory();

  describe('ExerciseDeckView', function(){

    it('should be defined', function(){
      expect(ExerciseDeckView).toBeDefined();
    });

    it('should display health', function(){
      this.fail('TODO');
    });

    it('should subtract from health when slide result is fail', function(){
      this.fail('TODO');
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
