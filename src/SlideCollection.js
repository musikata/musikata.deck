define(
  [
    'backbone',
    './SlideModel',
],
function(Backbone, SlideModel){
  return Backbone.Collection.extend({
    model: SlideModel
  });
});
