define(function(require){

  var _ = require('underscore');
  var BaseFactory = require('./BaseFactory');

  var ViewFactory = function(){
    BaseFactory.apply(this, arguments);
  };

  _.extend(ViewFactory.prototype, BaseFactory.prototype, {
    getViewClassForModel: function(model){
      var ViewClass = this.getHandler(model.get('type'));
      return ViewClass;
    },

    createView: function(options){
      var model = options.model;
      if (_.isUndefined(model) || _.isUndefined(model.get) ){
        throw new Error('No valid model provided');
      }

      var defaultOptions = {
        viewFactory: this
      };
      var mergedOptions = _.extend({}, defaultOptions, options);
      var ViewClass = this.getViewClassForModel(model);
      return new ViewClass(mergedOptions);
    }
  });

  return ViewFactory;
});
