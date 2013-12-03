define(
  [
    'require',
    'underscore',
    'deck/CompositeView',
    'deck/ViewFactory',
    'backbone',
    'marionette'
],
function(require, _, CompositeView, ViewFactory, Backbone){

  ddescribe('CompositeView', function(){

    // Setup view factory w/ a basic html view.
    var HtmlView = Marionette.ItemView.extend({
      template: _.template('<div><%= html %></div>')
    });
    var viewFactory = new ViewFactory();
    viewFactory.addHandler('html', HtmlView);
    viewFactory.addHandler('composite', CompositeView);

    // Setup model for each test.
    var compositeModel;
    beforeEach(function(){
      compositeModel = new Backbone.Model({
        title: 'the composite model',
        children: new Backbone.Collection(
          [
            new Backbone.Model({type: 'html', html: 'one'}),
            new Backbone.Model({type: 'composite', children: new Backbone.Collection([
                               new Backbone.Model({type: 'html', html: 'two.one'}),
                               new Backbone.Model({type: 'html', html: 'two.twow'}),
            ])})
        ])
      });
    });
    afterEach(function(){
      compositeModel = undefined;
    });

    it('should render subviews for each child', function(){
      var view = new CompositeView({
        model: compositeModel,
        viewFactory: viewFactory
      });
      view.render();
      var viewContent = view.$el.html();
      expect(viewContent).toContain('one');
      expect(viewContent).toContain('two.one');
      expect(viewContent).toContain('two.two');
    });
  });

});
