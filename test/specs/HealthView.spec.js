define(
  [
  'deck/HealthView',
  'deck/HealthModel',
],
function(
  HealthView,
  HealthModel
){
  ddescribe('HealthView', function(){

    var generateHealthView = function(){
      var healthModel = new HealthModel({
        size: 3,
      });
      var healthView = new HealthView({
        model: healthModel
      });
      return healthView;
    };

    it('should be defined', function(){
      expect(HealthView).toBeDefined();
    });

    it('should display correct number of health units per size', function(){
      var view = generateHealthView();
      view.render();
      expect(view.$el.find('.health_unit').length).toBe(view.model.get('size'));
      view.remove();
    });

    it('should update unit classes when currentHealth changes', function(){
      var view = generateHealthView();
      view.render();

      var getActualNumDisabledUnits = function(){
        return view.$el.find('.health_unit.disabled').length;
      };

      var getExpectedNumDisabledUnits = function(){
        return view.model.get("size") - view.model.get("currentHealth");
      };

      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.model.set('currentHealth', 2);
      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.model.set('currentHealth', 3);
      expect(getActualNumDisabledUnits()).toEqual(getExpectedNumDisabledUnits());
      view.remove();
    });

  });

});
