define(function(require){
  var DeckModel = require('deck/DeckModel');
  var Backbone = require('backbone');

  describe('DeckModel', function(){

    it('should be defined', function(){
      expect(DeckModel).toBeDefined();
    });

    describe('default attributes', function(){

      var deckModel;

      beforeEach(function(){
        deckModel = new DeckModel();
      });

      it('should have a slides attribute that is a collection', function(){
        expect(deckModel.get('slides') instanceof Backbone.Collection).toBe(true);
      });

      it('should have a currentSlideIndex attribute', function(){
        expect(deckModel.get('currentSlideIndex')).toBeDefined();
      });

    });

  });

});
