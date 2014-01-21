define(function(require){
  var Marionette = require('marionette');
  var ButtonView = require('./ButtonView');

  var NavigationView = Marionette.CollectionView.extend({
    itemView: ButtonView,
    itemViewEventPrefix: 'button'
  });

  return NavigationView;
});
