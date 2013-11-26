define(
  [
    'underscore',
    'backbone',
    './SlideCollection',
    './SlideModel',
],
function( _, Backbone, SlideCollection, SlideModel){

  var SlideCollectionParser = function(){};

  _.extend(SlideCollectionParser.prototype, {

    parseSlides: function(slides){
      var parsedSlides = new SlideCollection();
      _.each(slides, function(slide, idx){
        var slideModel = new SlideModel(slide);
        parsedSlides.add(slideModel);
      }, this);

      return parsedSlides;
    }

  });

  return SlideCollectionParser;
});
