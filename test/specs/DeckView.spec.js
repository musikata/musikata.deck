define(function(require){

  var _ = require('underscore');
  var DeckModel = require('deck/DeckModel');
  var DeckView = require('deck/DeckView');
  var HtmlView = require('deck/HtmlView');
  var ViewFactory = require('deck/ViewFactory');

  /*
   * Define generator functions.
   */

  var generateTestModels = function(options){
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

  var generateViewFactory = function(){
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('html', function(options){
      return new HtmlView(options);
    });
    return viewFactory;
  };

  var viewFactory = generateViewFactory();

  /*
   * Define tests.
   */

  describe('DeckView ', function(){

    describe('initial render', function(){

      describe('if there are slides', function(){
        var testModels;
        var deckView;

        beforeEach(function(){
          testModels = generateTestModels();
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
          testModels = generateTestModels({numSlides: 0});
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
        testModels = generateTestModels({numSlides: 2});
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
        deckView.trigger('goToNextSlide');
        var newCurrentSlideIndex = testModels.deck.get('currentSlideIndex');
        expect(newCurrentSlideIndex).toBe(oldCurrentSlideIndex + 1);
      });

    });

  });

});
