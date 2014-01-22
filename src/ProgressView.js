// @TODO: this is basically the same as ProgressView. Refactor later to share common code.
define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var ProgressViewTemplate = require('text!./templates/ProgressView.html');

  var ProgressView = Marionette.ItemView.extend({
    template: Handlebars.compile(ProgressViewTemplate),
    templateHelpers: {
      progressUnits: function(){
        var progressUnits = [];
        for (var i=0; i < this.size; i++){
          progressUnits.push({
            status: (i < this.currentProgress) ? '' : 'disabled'
          });
        }
        return progressUnits;
      }
    },

    ui: {
      'progressUnits': '.progress_unit'
    },

    modelEvents: {
      "change:currentProgress": "updateProgressUnits"
    },

    updateProgressUnits: function(){
      var currentProgress = this.model.get('currentProgress');
      this.ui.progressUnits.each(function(idx, el){
        if (idx < currentProgress){
          $(el).removeClass('disabled');
        }
        else{
          $(el).addClass('disabled');
        }
      });
    }

  });

  return ProgressView;
});
