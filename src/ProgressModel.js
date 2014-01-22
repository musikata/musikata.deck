define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');

  var ProgressModel = Backbone.Model.extend({
    defaults: {
      size: 3,
      currentProgress: 0
    },

    incrementCurrentProgress: function(x){
      if (_.isUndefined(x)){
        x = 1;
      }
      this.set('currentProgress', this.get('currentProgress') + x);
    }
  });

  return ProgressModel;
});

