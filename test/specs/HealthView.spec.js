define(
  [
  'deck/HealthView',
  'backbone'
],
function(
  HealthView,
  Backbone
){

  describe('HealthView', function(){

    var healthView;
    var healthModel;

    var generateHealthView = function(){
      healthModel = new Backbone.Model({
        size: 3,
      });
    };

    afterEach(function(){
      if (healthView){
        healthView.remove();
        healthView = null;
      }
    });

    it('should be defined', function(){
      expect(HealthView).toBeDefined();
    });

    it('should display correct number of health units per size', function(){
      this.fail('TODO');
    });

    it('should update unit classes when currentHealth changes', function(){
      this.fail('TODO');
    });

  });

});
