define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var CompositeView = Marionette.CompositeView.extend({
    template: _.template('<div class="testo"></div>'),
    itemViewContainer: '.testo',
    itemViewOptions: function(){
      var viewOptions = {
        viewFactory: this.options.viewFactory
      };
      return viewOptions;
    },
    constructor: function(options){
      var mergedOptions = _.extend({
        collection: options.model.get('children') || new Backbone.Collection()
      }, options);
      Marionette.CompositeView.prototype.constructor.apply(this, [mergedOptions]);
    },
    getItemView: function(item){
      var ViewClass = this.options.viewFactory.getViewClassForModel(item);
      return ViewClass;
    },

  });

  return CompositeView;
});
