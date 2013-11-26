define(
  [
    'underscore',
    'backbone',
    './SlideCollectionParser',
],
function( _, Backbone, SlideCollectionParser){
  return Backbone.Model.extend({
    defaults: {
      currentSlideIndex: 0,
      slides: null,
      initialHearts: 3,
      currentHearts: 3
    },


    // Custom parsing for handling complex nested attributes.
    parse: function(response, options){
      var parsedResponse = {};
      _.each(response, function(value, key){

        // If not given as a collection, parse slides into a collection.
        if (key == 'slides'){
          if (value instanceof Backbone.Collection){
            parsedResponse[key] = value;
          }
          else {
            var slideCollectionParser = new SlideCollectionParser();
            var parsedSlides = slideCollectionParser.parseSlides(value);
            parsedResponse[key] = parsedSlides;
          }
        }
        else{
          parsedResponse[key] = value;
        }
      }, this);

      return parsedResponse;
    },

  });
});
