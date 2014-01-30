define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var ModelFactory = require('./ModelFactory');

  var DeckModel = Backbone.Model.extend({

    defaults: {
      currentSlideIndex: 0,
      slides: null,
    },

    constructor: function(attrs, options){
      options = options || {};
      this.modelFactory = options.modelFactory || new ModelFactory();
      Backbone.Model.apply(this, arguments);
    },

    initialize: function(){
      var slides = this.get('slides');
      if (! (slides instanceof Backbone.Collection)){
        var slideCollection = new Backbone.Collection();
        _.each(slides, function(slide){
          var slideModel = this.modelFactory.createModel(slide);
          slideCollection.add(slideModel);
        }, this);
        this.set('slides', slideCollection);
      }
    },

    getCurrentSlideModel: function(){
      return this.get('slides').at(this.get('currentSlideIndex'));
    }

  });

  return DeckModel;
});
