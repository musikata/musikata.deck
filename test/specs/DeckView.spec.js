define(
  [
    'require',
    'underscore',
    'deck/DeckModel',
    'deck/DeckView',
    'deck/HtmlView',
    'deck/ViewFactory'
],
function(require, _, DeckModel, DeckView, HtmlView, ViewFactory){

  // Setup viewFactory.
  var viewFactory = new ViewFactory();
  viewFactory.addHandler('html', HtmlView);

  var createTestModels = function(options){
    var defaultOptions = {
      numSlides: 2
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    var slideModels = [];
    for(var i=0; i < mergedOptions.numSlides; i++){
      slideModels.push(new Backbone.Model({type: 'html', html: 'slide ' + i}));
    }
    testModels.slides = new Backbone.Collection(slideModels);
    testModels.deck = new DeckModel({slides: testModels.slides});

    return testModels;
  };

  describe('DeckView', function(){

    it('should be defined', function(){
      expect(DeckView).toBeDefined();
    });

    describe('initial render', function(){

      describe('if there are slides', function(){
        var testModels;
        var deckView;
        beforeEach(function(){
          testModels = createTestModels();
          deckView = new DeckView({
            model: testModels.deck,
            viewFactory: viewFactory
          });
        });

        afterEach(function(){
          deckView.close();
        });

        it('shows the first slide after initialization', function(){
          spyOn(deckView, 'showSlide');
          var firstSlideModel = testModels.slides.at(0);
          deckView.render();
          expect(deckView.showSlide).toHaveBeenCalledWith(firstSlideModel);
        });
      });

      describe('if there are no slides', function(){

        beforeEach(function(){
          testModels = createTestModels({numSlides: 0});
          deckView = new DeckView({
            model: testModels.deck,
            viewFactory: viewFactory
          });
        });

        afterEach(function(){
          deckView.close();
        });

        it('does not try to show a slide', function(){
          spyOn(deckView, 'showSlide');
          deckView.render();
          expect(deckView.showSlide).not.toHaveBeenCalled();
        });
      });
    });

    describe('after initialization', function(){

      var testModels;
      var deckView;

      beforeEach(function(){
        testModels = createTestModels({numSlides: 2});
        deckView = new DeckView({
          model: testModels.deck,
          viewFactory: viewFactory
        });
        deckView.render();
      });

      afterEach(function(){
        deckView.close();
      });

      it('renders the current slide when the currentSlideIndex changes', function(){
        spyOn(deckView, 'showSlide');
        testModels.deck.set({'currentSlideIndex': 1});
        var newCurrentSlideModel = testModels.slides.at(1);
        expect(deckView.showSlide).toHaveBeenCalledWith(
          newCurrentSlideModel);
      });

      it('increments currentSlideIndex when the next slide event is fired', function(){
        var oldCurrentSlideIndex = testModels.deck.get('currentSlideIndex');
        deckView.trigger('advanceSlide');
        var newCurrentSlideIndex = testModels.deck.get('currentSlideIndex');
        expect(newCurrentSlideIndex).toBe(oldCurrentSlideIndex + 1);
      });

      describe("the 'next' button", function(){

        it("should be present", function(){
          expect(deckView.ui.nextButton.length).toEqual(1);
        });

        describe("when the 'next' button is enabled", function(){

          beforeEach(function(){
            deckView.enableNextButton();
          });

          it("should have an enabled class", function(){
            expect(deckView.ui.nextButton.attr('class')).toContain('enabled');
          });

          describe("when it's clicked", function(){

            describe("when we're on the last slide", function(){
              beforeEach(function(){
                testModels.deck.set('currentSlideIndex', testModels.slides.length - 1);
              });

              it("should trigger a deck:completed event", function(){
                var spy = jasmine.createSpy();
                deckView.on('deck:completed', spy);
                deckView.ui.nextButton.trigger('click');
                expect(spy).toHaveBeenCalled();
              });
            });
            
            describe("when we're not on the last slide", function(){
              it("should advance to the next slide", function(){
                var spy = spyOn(deckView, 'advanceSlide');
                deckView.ui.nextButton.trigger('click');
                expect(spy).toHaveBeenCalled();
              });
            });
          });
        });

        describe("when the next button is disabled", function(){

          beforeEach(function(){
            deckView.disableNextButton();
          });

          it("should not have an enabled class", function(){
            var enabledClass = deckView.ui.nextButton.attr('class');
            if (enabledClass){
              expect(enabledClass).not.toContain('enabled');
            }
          });

          it("should ignore click events", function(){
            var spy = spyOn(deckView, 'onClickNextButton');
            deckView.ui.nextButton.trigger('click');
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });

    });

  });

});
