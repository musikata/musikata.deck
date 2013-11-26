define(
  [
    'require',
    'deck/DeckModel',
    'deck/InfoDeckView'
],
function(require, DeckModel, InfoDeckView){

  describe('InfoDeckView', function(){

    it('should be defined', function(){
      expect(InfoDeckView).toBeDefined();
    });

    describe('after rendering', function(){

      var slideDeckModel;
      var slideDeckView;
      var slides;

      beforeEach(function(){
        slideDeckModel = new DeckModel({
          slides: [
            {id: 'slide1'},
            {id: 'slide2'},
            {id: 'slide3'}
          ]
        }, {parse: true});

        slides = slideDeckModel.get('slides');

        infoDeckView = new InfoDeckView({
          model: slideDeckModel,
        });

        infoDeckView.render();
      });

      afterEach(function(){
        infoDeckView.close();
      });

      it('enables the next button', function(){
        infoDeckView.ui.nextButton.hasClass('enabled');
      });

    });

  });

});
