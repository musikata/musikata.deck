define(
  [
    'require',
    'deck/BaseDeckModel',
], function(require, BaseDeckModel){

  describe('BaseDeckModel', function(){

    it('should be defined', function(){
      expect(BaseDeckModel).toBeDefined();
    });

    describe('default attributes', function(){

      var deckModel;

      beforeEach(function(){
        deckModel = new BaseDeckModel();
      });

      it('should have a slides attribute', function(){
        expect(deckModel.get('slides')).toBeDefined();
      });

      it('should have a currentSlideIndex attribute', function(){
        expect(deckModel.get('currentSlideIndex')).toBeDefined();
      });

    });

  });

});
