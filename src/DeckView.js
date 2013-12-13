define(
  [
    'backbone',
    'marionette',
    'handlebars',
    './ViewFactory',
    'text!./templates/DeckView.html',
],
function(Backbone, Marionette, HB, ViewFactory, DeckViewTemplate){

  var DeckView = Marionette.Layout.extend({

    template: HB.compile(DeckViewTemplate),

    regions: {
      slide: '[data-role="slideRegion"]'
    },

    ui: {
      nextButton: '[data-role="nextButton"]',
      previousButton: '[data-role="previousButton"]',
      progressBar: '.progress-bar'
    },

    initialize: function(){
      this.model.on('change:currentSlideIndex', this.showCurrentSlide, this);
      this.on('advanceSlide', this.advanceSlide, this);
      this.on('goToNextSlide', this.goToNextSlide, this);
      this.on('goToPreviousSlide', this.goToPreviousSlide, this);
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

      // Update progress bar.
      // NOTE: might want to put progress bar in it's own view
      // later.
      this.updateProgressBar();

    },

    updateProgressBar: function(){
      var curIdx = this.model.get('currentSlideIndex');
      this.ui.progressBar.find('li').each(function(idx, el){
        if (idx < curIdx){
          $(el).addClass('done');
        }
        else{
          $(el).removeClass('done');
        }
      });
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

    showSlide: function(slideModel){
      var slideView = this.options.viewFactory.createView({
        model: slideModel,
        viewFactory: this.options.viewFactory
      });
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
        this.goToNextSlide();
      }
    },

    enablePreviousButton: function(){
      if (this.ui.previousButton.hasClass('enabled')){
        return;
      }
      this.ui.previousButton.addClass('enabled');
      this.ui.previousButton.on('click', _.bind(this.onClickPreviousButton, this));
    },

    disablePreviousButton: function(){
      this.ui.previousButton.removeClass('enabled');
      this.ui.previousButton.off('click');
    },

    onClickPreviousButton: function(){
      this.goToPreviousSlide();
    },

    onBeforeClose: function(){
      return true;
    }

  });

  return DeckView;
});
