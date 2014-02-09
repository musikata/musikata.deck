define(function(require){
  var Marionette = require('marionette');
  var ButtonView = require('./ButtonView');

  var NavigationView = Marionette.CollectionView.extend({
    attributes: {
      class: 'navigation'
    },
    itemView: ButtonView,
    itemViewEventPrefix: 'button'
  });

  return NavigationView;
});
