define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var HtmlView = Marionette.ItemView.extend({
    template: _.template('<%= html %>'),
  });
  return HtmlView;
});
