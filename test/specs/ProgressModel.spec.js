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

      it('currentProgress should default to 0 if not set', function(){
        var model = new ProgressModel({
          size: 3
        });
        expect(model.get('currentProgress')).toEqual(0);
      });

      it('incrementCurrentProgress shoudld increase currentProgress by default or x', function(){
        var model = new ProgressModel({
          size: 3
        });
        model.incrementCurrentProgress();
        expect(model.get('currentProgress')).toEqual(1);
        model.incrementCurrentProgress(2);
        expect(model.get('currentProgress')).toEqual(3);
      });

    });

  });

});
