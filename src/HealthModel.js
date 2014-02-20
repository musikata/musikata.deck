define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');

  var HealthModel = Backbone.Model.extend({
    defaults: {
      size: 3,
    },

    initialize: function(){

      // Set default current health to size if not set.
      if (_.isUndefined(this.get('currentHealth'))){
        this.set('currentHealth', this.get('size'));
      }

      // Fire 'empty' event when currentHealth reaches 0.
      this.on('change:currentHealth', function(_this, currentHealth){
        if (currentHealth == 0){
          _this.trigger('empty');
        }
      });
    },

    decrementCurrentHealth: function(x){
      if (_.isUndefined(x)){
        x = 1;
      }
      this.set('currentHealth', this.get('currentHealth') - x);
    }
  });

  return HealthModel;
});

