define(function(require){
  var Backbone = require('backbone');
  var SlideModel = require('./SlideModel');
  return SlideModel.extend({
    initialize: function(attrs, opts){
      SlideModel.prototype.initialize.apply(this, [attrs, opts]);

      var submission = this.get('submission');
      if (! (submission instanceof Backbone.Model)){
        this.set('submission', new Backbone.Model(submission));
      }
    }
  });
});
