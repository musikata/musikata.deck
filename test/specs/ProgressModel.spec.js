define(
  [
  'deck/ProgressModel',
],
function(
  ProgressModel
){

  describe('ProgressModel', function(){

    it('should be defined', function(){
      expect(ProgressModel).toBeDefined();
    });

    describe('default attributes', function(){

      it('should have a size attribute', function(){
        var model = new ProgressModel();
        expect(model.get('size')).toBeDefined();
      });

      it('should have a currentProgress attribute', function(){
        var model = new ProgressModel();
        expect(model.get('currentProgress')).toBeDefined();
      });

      it('currentProgress should default to size if not set', function(){
        var model = new ProgressModel({
          size: 3
        });
        expect(model.get('currentProgress')).toEqual(3);
      });

      it('decrementCurrentProgress shoudld reduce currentProgress by default or x', function(){
        var model = new ProgressModel({
          size: 3
        });
        model.decrementCurrentProgress();
        expect(model.get('currentProgress')).toEqual(2);
        model.decrementCurrentProgress(2);
        expect(model.get('currentProgress')).toEqual(0);
      });

    });

  });

});
