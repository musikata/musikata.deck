define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var NavigationView = Marionette.ItemView.extend({
    template: Handlebars.compile('foo'),
  });

  return NavigationView;
});
