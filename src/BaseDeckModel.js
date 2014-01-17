define(
  [
    'underscore',
    'backbone',
    './ModelFactory'
],
function( _, Backbone, ModelFactory){

  var BaseDeckModel = Backbone.Model.extend({

    defaults: {
      currentSlideIndex: 0,
      slides: null,
    },

    constructor: function(attrs, options){
      options = options || {};
      this.modelFactory = options.modelFactory || new ModelFactory();
      Backbone.Model.apply(this, arguments);
    },

    parse: function(response, options){
      var parsedAttrs = {};
      _.each(response, function(value, key){

        if (key == 'slides'){
          if (! (value instanceof Backbone.Collection)){
            var slideDefinitions = value;
            var parsedSlides = new Backbone.Collection();
            _.each(slideDefinitions, function(slideDefinition){
              var slideModel = this.modelFactory.createModel(slideDefinition);
              parsedSlides.add(slideModel);
            }, this);
            value = parsedSlides;
          }
        }
        parsedAttrs[key] = value;
      }, this);

      return parsedAttrs;
    },

  });

  return BaseDeckModel;
});
