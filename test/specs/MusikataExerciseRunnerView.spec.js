define(function(require){
  var MusikataExerciseRunnerView = require('deck/MusikataExerciseRunnerView');

  describe('MusikataExerciseRunnerView', function(){
    it('should be defined', function(){
      expect(MusikataExerciseRunnerView).toBeDefined();
    });

    describe('intro slides', function(){

      it('should show intro slides if provided', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should advance through intro slides w/out changing progress bar', function(){
        this.fail('NOT IMPLEMENTED');
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
