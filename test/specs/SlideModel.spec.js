define(
  [
    'require',
    'deck/SlideModel',
], function(require, SlideModel){

  describe('SlideModel', function(){

    it('should be defined', function(){
      expect(SlideModel).toBeDefined();
    });

    describe('SlideModel Attributes', function(){

      var slideModel;

      beforeEach(function(){
        slideModel = new SlideModel();
      });

      it('should have a type attribute', function(){
        expect(slideModel.get('type')).toBeDefined();
      });

    });
  });

});
