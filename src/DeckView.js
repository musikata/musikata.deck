define(function(require){

  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var DeckViewTemplate = require('text!./templates/DeckView.html');

  var DeckView = Marionette.Layout.extend({

    template: Handlebars.compile(DeckViewTemplate),

    attributes: {
      class: 'deck',
    },

    regions: {
      slide: '.slide-region'
    },

    modelEvents: {
      'change:currentSlideIndex': 'showCurrentSlide'
    },

    initialize: function(){
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
      var numSlides = this.model.get('slides').length;
      if  (index < 0 || index >= numSlides){
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

    onSlideShow: function(view){
      this.trigger('slide:show', view);
    },

    onSlideClose: function(view){
      this.trigger('slide:close', view);
    },

    showCurrentSlide: function(){
      var currentIndex = this.model.get('currentSlideIndex');
      var slides = this.model.get('slides');
      var currentSlideModel = slides.at(currentIndex);
      this.showSlide(currentSlideModel);

      // Trigger lastSlide event.
      // This can make runner code cleaner.
      if (currentIndex == (slides.length - 1)){
        this.trigger('lastSlide');
      }
    },

    showSlide: function(slideModel){
      var slideView = this.options.viewFactory.createView({
        model: slideModel,
        attributes: {
          class: 'slide'
        }
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
