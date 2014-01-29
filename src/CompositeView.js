define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var CompositeView = Marionette.CompositeView.extend({
    template: _.template('<div class="testo"></div>'),
    itemViewContainer: '.testo',
    constructor: function(options){
      var mergedOptions = _.extend({
        collection: options.model.get('children') || new Backbone.Collection()
      }, options);
      Marionette.CompositeView.prototype.constructor.apply(this, [mergedOptions]);
    },
    buildItemView: function(item, ItemViewType, itemViewOptions){
      var options = _.extend({model:item}, itemViewOptions);
      return this.options.viewFactory.createView(options);
    },

  });

  return CompositeView;
});
