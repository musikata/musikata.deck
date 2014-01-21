define(function(require){

  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ViewFactory = require('deck/ViewFactory');
  var DeckModel = require('deck/DeckModel');
  var DeckView = require('deck/DeckView');
  var HtmlView = require('deck/HtmlView');
  var MusikataExerciseRunnerModel = require('deck/MusikataExerciseRunnerModel');
  var MusikataExerciseRunnerView = require('deck/MusikataExerciseRunnerView');

  // Define a test exercise.
  var SillyExercise = Marionette.ItemView.extend({
    template: Handlebars.compile(
      '<button id="pass" value="pass"><button id="fail" value="fail">'
    ),
    events: {
      'click button': 'onButtonClick'
    },
    onRender: function(){
      this.trigger('ready');
    },
    onButtonClick: function(e){
      var passFail = $(e.target).attr("id");
      this.model.set('result', passFail);
    }
  });

  /*
   * Define generator functions.
   */

  var generateViewFactory = function(){
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('silly', SillyExercise);
    viewFactory.addHandler('html', HtmlView);
    return viewFactory;
  };

  var generateDeckModel = function(overrides){
    var opts = _.extend({
      numSlides: 3,
      generateSlideModel: function(idx){
        return new Backbone.Model({
          id: idx,
          type: 'html',
          html: '<span>slide #' + idx + '</span>'
        });
      }
    }, overrides);

    var slideModels = [];
    for(var i=0; i < opts.numSlides; i++){
      slideModels.push(opts.generateSlideModel(i));
    }
    var slidesCollection = new Backbone.Collection(slideModels);
    var deckModel = new DeckModel({
      slides: slidesCollection
    }, {parse: true});

    return deckModel;
  };

  var generateTestModels = function(options){
    var defaultOptions = {
      numSlides: 4
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    testModels.introDeck = generateDeckModel();

    testModels.exerciseDeck = generateDeckModel({
      generateSlideModel: function(idx){
        return new Backbone.Model({id: idx, type: 'silly'});
      }
    });

    testModels.runnerModel = new MusikataExerciseRunnerModel({
      introDeck: testModels.introDeck,
      exerciseDeck: testModels.exerciseDeck
    });

    return testModels;
  };

  var generateRunnerView = function(overrides){

    var opts = _.extend({
      model: generateTestModels().runnerModel,
      getOutroView: null,
      viewFactory: generateViewFactory()
    }, overrides);

    var runnerView = new MusikataExerciseRunnerView(opts);

    return runnerView;
  };


  describe('MusikataExerciseRunnerView', function(){
    it('should be defined', function(){
      expect(MusikataExerciseRunnerView).toBeDefined();
    });

    describe('intro slides', function(){

      it('should show intro slides if provided', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        var bodyView = runnerView.body.currentView;
        var introSlides = runnerView.model.get('introDeck').get('slides');
        expect(bodyView.model.get('slides')).toBe(introSlides);
        this.after(function(){runnerView.remove()});
      });

      it('should show navigation for intro slides', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        expect(nextButtonToBeThere);
        this.fail('NOT IMPLEMENTED');
        this.after(function(){runnerView.remove()});
      });

      it('should advance through intro slides w/out changing progress bar', function(){
        var runnerView =  generateRunnerView();
        runnerView.render();
        this.fail('NOT IMPLEMENTED');
        this.after(function(){runnerView.remove()});
      });

      it('should start show exercise slides when intro slides are done', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should start showing exercise slides if there were no intro slides', function(){
        this.fail('NOT IMPLEMENTED');
      });

    });

    describe('exercise slides', function(){
      it('should change navigation buttons when going through exercise slides', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should change progress bar when going through exercise slides', function(){
        this.fail('NOT IMPLEMENTED');
      });
    });

    describe('outro view', function(){
      it('should show outro view when deck completion event fires', function(){
      });

      it('should change navigation buttons when showing outro view', function(){
      });

      it("should show 'try again' view if runner result was 'fail'", function(){
      });

      it("should show 'pass' view if runner result was 'pass'", function(){
      });

      it("should show milestone 'pass' view if runner result was 'pass' and we're a milestone", function(){
      });
    });

  });
});
