define(
  [
    'underscore',
    'backbone',
    './ModelFactory',
],
function(_, Backbone, ModelFactory){

  var CompositeModel = Backbone.Model.extend({
    constructor: function(attrs, options){
      options = options || {};
      this.modelFactory = options.modelFactory || new ModelFactory();
      Backbone.Model.apply(this, arguments);
    },

    parse: function(response, options){
      var parsedAttrs = {};

      _.each(response, function(value, key){

        if (key == 'children'){
          var childDefinitions = value;
          var children = new Backbone.Collection();

          _.each(childDefinitions, function(childDefinition){
            var childModel = this.modelFactory.createModel(childDefinition);
            children.add(childModel);
          }, this);

          value = children;
        }

        parsedAttrs[key] = value;

      }, this);

      return parsedAttrs;
    }
  });

  return CompositeModel;
});
