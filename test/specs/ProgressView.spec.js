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
      expect(view.$el.find('.progress_unit').length).toBe(view.model.get('size'));
      view.remove();
    });

    it('should update unit classes when currentProgress changes', function(){
      var view = generateProgressView();
      view.render();

      var getActualNumDisabledUnits = function(){
        return view.$el.find('.progress_unit.disabled').length;
      };

      var getExpectedNumDisabledUnits = function(){
        return view.model.get("size") - view.model.get("currentProgress");
      };

      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.model.set('currentProgress', 2);
      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.model.set('currentProgress', 3);
      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.remove();
    });

  });

});
