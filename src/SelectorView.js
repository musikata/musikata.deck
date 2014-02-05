define(function(require){
  var $ = require('jquery');
  var Marionette = require('marionette');

  var SelectorView = Marionette.ItemView.extend({
    getTemplate: function(){
      return this.model.get('selector');
    }
  });
  return SelectorView;
});
