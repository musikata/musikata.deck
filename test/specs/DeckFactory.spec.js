define(
  [
    'require',
    'deck/DeckFactory',
    'deck/DeckView'
],
function(require, DeckFactory, DeckView){

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

    describe("deck creation", function(){
      var deckDefinition = {
        title: 'Deck Title',
        slides: [
          {type: 'html', title: 'first slide', html: 'first slide body'},
          {type: 'html', title: 'second slide', html: 'second slide body'},
        ]
      };

      it("should be able to create a deck view from a definition", function(){
        var deckView = deckFactory.createDeck(deckDefinition);
        expect(deckView instanceof DeckView).toBe(true);
      });
    });

  });

});
