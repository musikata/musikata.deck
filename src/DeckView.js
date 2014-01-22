define(function(require){

  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var ViewFactory = require('./ViewFactory');
  var DeckViewTemplate = require('text!./templates/DeckView.html');

  var DeckView = Marionette.Layout.extend({

    template: Handlebars.compile(DeckViewTemplate),

    regions: {
      slide: '[data-role="slideRegion"]'
    },

    initialize: function(){
      this.model.on('change:currentSlideIndex', this.showCurrentSlide, this);
      this.on('goToNextSlide', this.goToNextSlide, this);
      this.on('goToPreviousSlide', this.goToPreviousSlide, this);

      // For nav events. Not sure yet if we want to couple to event IDs here, or in RunnerView.
      // If we couple here by convention, it does make code a bit cleaner methinks.
      this.on('continue', this.goToNextSlide, this);
    },

    goToNextSlide: function(){
      var oldIndex = this.model.get('currentSlideIndex');
      this.goToSlide(oldIndex + 1);
    },

    goToPreviousSlide: function(){
      var oldIndex = this.model.get('currentSlideIndex');
      this.goToSlide(oldIndex - 1);
    },

    goToSlide: function(index){
      if  (index < 0 || index >= this.model.get('slides').length){
        throw new Error("Slide index '" + index + "' is out-of-bounds");
      }
      this.model.set('currentSlideIndex', index);
    },

    onRender: function(){
      // Wire completion event.
      this.on('deck:completed', this.onCompleted, this);

      // Wire slide region show/close events.
      this.slide.on('show', this.onSlideShow, this);
      this.slide.on('close', this.onSlideClose, this);

      // Render initial slide if present and currentSlideIndex is set.
      if (this.model.get('slides')
          && this.model.get('slides').length
        && (this.model.get('currentSlideIndex') != undefined)) {
          this.showCurrentSlide();
        }

    },

    onSlideShow: function(){
      this.trigger('slide:show');
    },

    onSlideClose: function(){
      this.trigger('slide:close');
    },

    showCurrentSlide: function(){
      var currentSlide = this.model.get('slides').at(
        this.model.get('currentSlideIndex'));
        this.showSlide(currentSlide);
    },

    showSlide: function(slideModel){
      var slideView = this.options.viewFactory.createView({
        model: slideModel,
        viewFactory: this.options.viewFactory
      });
      // DO LOGIC FOR WAITING WHEN SLIDE IS READY HERE? OR AFTER SHOWING THE
      // SLIDE?
      this.slide.show(slideView);
    },

    onBeforeClose: function(){
      return true;
    },

    onCompleted: function(){
    }

  });

  return DeckView;
});
