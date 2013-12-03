define(
  [
    'backbone',
    'marionette',
    './ViewFactory',
    'text!./templates/DeckView.html',
],
function(Backbone, Marionette, DeckViewTemplate){

  var DeckView = Marionette.Layout.extend({

    constructor: function(options){
      options = options || {};
      this.viewFactory = options.viewFactory || new ViewFactory();
      Marionette.Layout.prototype.constructor.apply(this, arguments);
    },

    template: DeckViewTemplate,

    regions: {
      slide: '[data-role="slideRegion"]'
    },

    ui: {
      nextButton: '[data-role="nextButton"]'
    },

    initialize: function(){
      this.model.on('change:currentSlideIndex', this.showCurrentSlide, this);
      this.on('advanceSlide', this.advanceSlide, this);
      this.on('slide:submitted', this.onSlideSubmitted, this);
    },

    advanceSlide: function(){
      var oldIndex = this.model.get('currentSlideIndex');
      this.model.set('currentSlideIndex', oldIndex + 1);
    },

    onRender: function(){
      // Render initial slide if present and currentSlideIndex is set.
      if (this.model.get('slides')
          && this.model.get('slides').length
        && (this.model.get('currentSlideIndex') != undefined)) {
          this.showCurrentSlide();
      }
    },

    showCurrentSlide: function(){
      var currentSlide = this.model.get('slides').at(
        this.model.get('currentSlideIndex'));
      this.showSlide(currentSlide);
    },

    goToSlide: function(index){
      this.model.set('currentSlideIndex', index);
    },

    showSlide: function(slide){
      var slideView = this.viewFactory.createView(slide);
      // DO LOGIC FOR WAITING WHEN SLIDE IS READY HERE? OR AFTER SHOWING THE
      // SLIDE?
      this.slide.show(slideView);
    },

    // NOTE: later we might want to put this into a subclass,
    // e.g. 'TestSlideDeck', or 'ExerciseSlideDeck'.
    onSlideSubmitted: function(data){

      this.enableNextButton();

      if (data.result == 'pass'){
        // Nothing here yet...
      }
      else if (data.result == 'fail'){
        this.decrementHearts();
      }
    },

    decrementHearts: function(){
      var currentHearts = this.model.get('currentHearts');
      this.model.set('currentHearts', currentHearts - 1);
    },

    // NOTE: later on might want to factor out nav buttons into their own view.
    enableNextButton: function(){
      this.ui.nextButton.addClass('enabled');
      this.ui.nextButton.on('click', _.bind(this.onClickNextButton, this));
    },

    disableNextButton: function(){
      this.ui.nextButton.removeClass('enabled');
      this.ui.nextButton.off('click');
    },

    onClickNextButton: function(){
      if (this.model.get('currentSlideIndex') == this.model.get('slides').length - 1){
        this.trigger('deck:completed');
      }
      else{
        this.advanceSlide();
      }
    },

    onBeforeClose: function(){
      return true;
    }

  });

  return DeckView;
});
