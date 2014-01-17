define(
  [
  'backbone'
],
function(
  Backbone
){
   var HealthModel = Backbone.Model.extend({
     defaults: {
       size: 3,
       currentHealth: 3
     }
   });

   return HealthModel;
});

