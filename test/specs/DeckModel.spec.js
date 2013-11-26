define(
  [
    'require',
    'deck/DeckModel',
], function(require, DeckModel){

  describe('DeckModel', function(){

    it('should be defined', function(){
      expect(DeckModel).toBeDefined();
    });

    describe('default attributes', function(){

      var deckModel;

      beforeEach(function(){
        deckModel = new DeckModel();
      });

      it('should have a slides attribute', function(){
        expect(deckModel.get('slides')).toBeDefined();
      });

      it('should have a currentSlideIndex attribute', function(){
        expect(deckModel.get('currentSlideIndex')).toBeDefined();
      });

      it('should have an initialHearts attribute', function(){
        expect(deckModel.get('initialHearts')).toBeDefined();
      });

      it('should have a currentHearts attribute', function(){
        expect(deckModel.get('currentHearts')).toBeDefined();
      });

    });

  });

});
