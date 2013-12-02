define(
  [
    'require',
    'deck/DeckFactory',
],
function(require, DeckFactory){

  ddescribe('DeckFactory', function(){

    var deckFactory;
    beforeEach(function(){
      deckFactory = new DeckFactory();
    });
    afterEach(function(){
      deckFactory = undefined;
    });

    describe('model parsing', function(){

      it("should have a model factory", function(){
        expect(deckFactory.modelFactory).toBeDefined();
      });

      describe('core plugins', function(){

        it("should have an HTML Model Handler", function(){
          expect(deckFactory.modelFactory.getHandler('html')).toBeDefined();
        });

        it("should have a composite model plugin", function(){
          expect(deckFactory.modelFactory.getHandler('composite')).toBeDefined();
        });

      });

    });

  });

});
