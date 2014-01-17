define(
  [
  'backbone',
  'underscore'
],
function(
  Backbone,
  _
){
   var HealthModel = Backbone.Model.extend({
     defaults: {
       size: 3,
     },

     initialize: function(){
       // Set default current health to size if not set.
       if (_.isUndefined(this.get('currentHealth'))){
         this.set('currentHealth', this.get('size'));
       }
     }
   });

   return HealthModel;
});

