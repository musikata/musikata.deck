define(
  [
  'deck/ProgressView',
  'deck/ProgressModel',
],
function(
  ProgressView,
  ProgressModel
){
  describe('ProgressView', function(){

    var generateProgressView = function(){
      var progressModel = new ProgressModel({
        size: 3,
      });
      var progressView = new ProgressView({
        model: progressModel
      });
      return progressView;
    };

    it('should be defined', function(){
      expect(ProgressView).toBeDefined();
    });

    it('should display correct number of progress units per size', function(){
      var view = generateProgressView();
      view.render();
      expect(view.ui.progressUnits.length).toBe(view.model.get('size'));
      view.remove();
    });

    it('should update unit classes when currentProgress changes', function(){
      var view = generateProgressView();
      view.render();

      var getActualNumCompletedUnits = function(){
        return view.ui.progressUnits.filter('.completed').length;
      };

      var getExpectedNumCompletedUnits = function(){
        return view.model.get("currentProgress");
      };

      expect(getActualNumCompletedUnits()).toEqual(getExpectedNumCompletedUnits());
      view.model.set('currentProgress', 2);
      expect(getActualNumCompletedUnits()).toEqual(getExpectedNumCompletedUnits());
      view.model.set('currentProgress', 3);
      expect(getActualNumCompletedUnits()).toEqual(getExpectedNumCompletedUnits());
      view.remove();
    });

  });

});
