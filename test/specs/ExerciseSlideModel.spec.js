define(function(require){
  var Backbone = require('backbone');
  var ExerciseSlideModel = require('deck/ExerciseSlideModel');

  describe('ExerciseSlideModel', function(){

    it('should be defined', function(){
      expect(ExerciseSlideModel).toBeDefined();
    });

    describe('ExerciseSlideModel Attributes', function(){

      var model;
      beforeEach(function(){
        model = new ExerciseSlideModel();
      });

      it('should have a type attribute', function(){
        expect(model.get('type')).toBeDefined();
      });

      it('should have a submission attribute', function(){
        var submission = model.get('submission');
        expect(submission).toBeDefined();
        expect(submission instanceof Backbone.Model).toBe(true);
      });

    });
  });

});
