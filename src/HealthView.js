define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var HealthViewTemplate = require('text!./templates/HealthView.html');

  var HealthView = Marionette.ItemView.extend({
    className: 'health-bar',
    template: Handlebars.compile(HealthViewTemplate),
    templateHelpers: {
      healthUnits: function(){
        var healthUnits = [];
        for (var i=0; i < this.size; i++){
          healthUnits.push({
            status: (i < this.currentHealth) ? '' : 'empty'
          });
        }
        return healthUnits;
      }
    },

    ui: {
      'healthUnits': '.health-unit'
    },

    modelEvents: {
      "change:currentHealth": "updateHealthUnits"
    },

    updateHealthUnits: function(){
      var currentHealth = this.model.get('currentHealth');
      this.ui.healthUnits.each(function(idx, el){
        if (idx < currentHealth){
          $(el).removeClass('empty');
        }
        else{
          $(el).addClass('empty');
        }
      });
    }

  });

  return HealthView;
});
