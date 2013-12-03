define(
  [
    'underscore',
    'backbone',
    'marionette',
],
function(_, Backbone, Marionette){

  var HtmlView = Marionette.ItemView.extend({
    template: _.template('<%= html %>'),
  });
  return HtmlView;
});
