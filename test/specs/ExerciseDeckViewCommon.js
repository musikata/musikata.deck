define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var ExerciseDeckModel = require('deck/ExerciseDeckModel');
  var ExerciseDeckView = require('deck/ExerciseDeckView');
  var ViewFactory = require('deck/ViewFactory');

  var ExerciseDeckCommon = {};

  // Define a test exercise.
  ExerciseDeckCommon.SillyExercise = Marionette.ItemView.extend({
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

  ExerciseDeckCommon.generateViewFactory = function(){
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('silly', ExerciseDeckCommon.SillyExercise);
    return viewFactory;
  }

  ExerciseDeckCommon.generateTestModels = function(options){
    var defaultOptions = {
      numSlides: 4
    };

    var mergedOptions = _.extend({}, defaultOptions, options);

    var testModels = {};

    var slideModels = [];
    for(var i=0; i < mergedOptions.numSlides; i++){
      slideModels.push(new Backbone.Model({type: 'silly'}));
    }
    testModels.slides = new Backbone.Collection(slideModels);
    testModels.deck = new ExerciseDeckModel({slides: testModels.slides});

    return testModels;
  };

  ExerciseDeckCommon.generateDeckView = function(){
    var testModels = ExerciseDeckCommon.generateTestModels();
    var deckView = new ExerciseDeckView({
      model: testModels.deck,
      viewFactory: ExerciseDeckCommon.generateViewFactory()
    });
    return deckView;
  };

  return ExerciseDeckCommon;

});
