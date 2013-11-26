define(
  [
    './DeckView',
],
function(DeckView){

  var InfoDeckView = DeckView.extend({

    onRender: function(){
      DeckView.prototype.onRender.apply(this, arguments);
      this.enableNextButton();
    },
  });

  return InfoDeckView;
});
