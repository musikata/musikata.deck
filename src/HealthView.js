define(
  [
  'marionette',
  'handlebars',
  'text!./templates/HealthView.html'
],
function(
  Marionette,
  Handlebars,
  HealthViewTemplate
){

  var HealthView = Marionette.ItemView.extend({
    template: Handlebars.compile(HealthViewTemplate),
    templateHelpers: {
      healthUnits: function(){
        var healthUnits = [];
        for (var i=0; i < this.size; i++){
          healthUnits.push({
            status: (i < this.currentHealth) ? '' : 'disabled'
          });
        }
        return healthUnits;
      }
    },

    ui: {
      'healthUnits': '.health_unit'
    },

    modelEvents: {
      "change:currentHealth": "updateHealthUnits"
    },

    updateHealthUnits: function(){
      var currentHealth = this.model.get('currentHealth');
      this.ui.healthUnits.each(function(idx, el){
        if (idx < currentHealth){
          $(el).removeClass('disabled');
        }
        else{
          $(el).addClass('disabled');
        }
      });
    }

  });

  return HealthView;
});
