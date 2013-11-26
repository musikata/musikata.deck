define(
  [
    'require',
    'deck/DeckModel',
    'deck/DeckView'
],
function(require, DeckModel, DeckView){

  describe('DeckView', function(){

    it('should be defined', function(){
      expect(DeckView).toBeDefined();
    });

    describe('initial render', function(){

      describe('if there are slides', function(){
        var deckModel;
        var deckView;
        var slides;

        beforeEach(function(){

          // Setup test models.
          deckModel = new DeckModel({
            slides: [{}, {}, {}]
          }, {parse: true});
          slides = deckModel.get('slides');

          deckView = new DeckView({
            model: deckModel,
          });

        });

        afterEach(function(){
          deckView.close();
        });

        it('shows the first slide after initialization', function(){
          spyOn(deckView, 'showSlide');
          var firstSlideModel = slides.at(0);
          deckView.render();
          expect(deckView.showSlide).toHaveBeenCalledWith(firstSlideModel);
        });
      });

      describe('if there are no slides', function(){

        var deckModel;
        var deckView;
        var slides;

        beforeEach(function(){

          // Setup test models.
          deckModel = new DeckModel({
            slides: []
          });

          deckView = new DeckView({
            model: deckModel,
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

      var deckModel;
      var deckView;
      var slides;

      beforeEach(function(){
        deckModel = new DeckModel({
          slides: [
            {id: 'slide1'},
            {id: 'slide2'},
            {id: 'slide3'}
          ]
        }, {parse: true});

        slides = deckModel.get('slides');

        deckView = new DeckView({
          model: deckModel,
        });

        deckView.render();
      });

      afterEach(function(){
        deckView.close();
      });

      it('renders the current slide when the currentSlideIndex changes', function(){
        spyOn(deckView, 'showSlide');
        deckModel.set({'currentSlideIndex': 1});
        var newCurrentSlideModel = slides.at(1);
        expect(deckView.showSlide).toHaveBeenCalledWith(
          newCurrentSlideModel);
      });

      it('increments currentSlideIndex when the next slide event is fired', function(){
        var oldCurrentSlideIndex = deckModel.get('currentSlideIndex');
        deckView.trigger('advanceSlide');
        var newCurrentSlideIndex = deckModel.get('currentSlideIndex');
        expect(newCurrentSlideIndex).toBe(oldCurrentSlideIndex + 1);
      });

      // note: might want to move this into subclass later.
      describe('when a slide submission event is triggered', function(){

        var checkEnableNextButton = function(submissionData){
          var spy = spyOn(deckView, 'enableNextButton');
          deckView.trigger('slide:submitted', submissionData);
          expect(spy).toHaveBeenCalled();
        };

        describe("when the submission result is a pass", function(){

          var submissionData = {result: 'pass'};

          it("enables the 'next' button", function(){
            checkEnableNextButton(submissionData);
          });

          it("does not decrement the heart count", function(){
            var previousHearts = deckView.model.get('currentHearts');
            deckView.trigger('slide:submitted', submissionData);
            var newHearts = deckView.model.get('currentHearts');
            expect(newHearts).toEqual(previousHearts);
          });


        });

        describe("when the submission result is a fail", function(){

          var submissionData = {result: 'fail'};

          it("enables the 'next' button", function(){
            checkEnableNextButton(submissionData);
          });

          it("decrements the heart count", function(){
            var previousHearts = deckView.model.get('currentHearts');
            deckView.trigger('slide:submitted', submissionData);
            var newHearts = deckView.model.get('currentHearts');
            expect(newHearts).toEqual(previousHearts - 1);
          });
        });

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
                deckModel.set('currentSlideIndex', deckModel.get('slides').length - 1);
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
