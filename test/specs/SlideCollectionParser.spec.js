define(
  [
    'require',
    'deck/SlideCollectionParser',
    'deck/SlideModel',
], function(require, SlideCollectionParser, SlideModel){

  describe('SlideCollectionParser', function(){

    it('should be defined', function(){
      expect(SlideCollectionParser).toBeDefined();
    });

    describe('parsing slides', function(){
      var parser;
      beforeEach(function(){
        parser = new SlideCollectionParser();
      });

      it('should parse generic slides', function(){
        var slides = [{type: ''}];
        var parsedSlides = parser.parseSlides(slides);
        var slide = parsedSlides.at(0);
        expect(slide instanceof SlideModel).toBeTruthy()
      });

    });

  });

});
