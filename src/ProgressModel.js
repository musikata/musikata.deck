define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');

  var ProgressModel = Backbone.Model.extend({
    defaults: {
      size: 3,
    },

    initialize: function(){

      // Set default current progress to size if not set.
      if (_.isUndefined(this.get('currentProgress'))){
        this.set('currentProgress', this.get('size'));
      }
    },

    decrementCurrentProgress: function(x){
      if (_.isUndefined(x)){
        x = 1;
      }
      this.set('currentProgress', this.get('currentProgress') - x);
    }
  });

  return ProgressModel;
});

