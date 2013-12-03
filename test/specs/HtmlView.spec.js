define(
  [
    'require',
    'deck/HtmlView',
    'backbone',
],
function(require, HtmlView, Backbone){

  ddescribe('HtmlView', function(){

    // Setup model for each test.
    var htmlModel;
    beforeEach(function(){
      htmlModel = new Backbone.Model({
        type: 'html',
        html: '<p>Some HTML!</p>',
      });
    });
    afterEach(function(){
      htmlModel = undefined;
    });

    it('should render correctly', function(){
      var view = new HtmlView({model: htmlModel});
      view.render();
      var viewContent = view.$el.html();
      expect(viewContent).toContain(htmlModel.get('html'));
    });
  });

});
