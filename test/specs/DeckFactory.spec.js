define(
  [
    'require',
    'deck/DeckFactory',
    'deck/DeckView'
],
function(require, DeckFactory, DeckView){

  describe('DeckFactory', function(){

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
          {type: 'composite', title: 'second slide', children: [
            {type: 'html', html: 'section one'},
            {type: 'html', html: 'section two'}
          ]}
        ]
      };

      it("should be able to create a deck view from a definition", function(){
        var deckView = deckFactory.createDeck(deckDefinition);
        expect(deckView instanceof DeckView).toBe(true);
      });

      it("should have the correct content", function(){
        var deckView = deckFactory.createDeck(deckDefinition);
        deckView.render();
        deckView.goToSlide(0);
        expect(deckView.$el.html()).toContain('first slide');
        deckView.goToSlide(1);
        expect(deckView.$el.html()).toContain('section one');
        expect(deckView.$el.html()).toContain('section two');
      });
    });

  });

});
