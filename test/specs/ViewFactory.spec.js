define(
  [
    'require',
    'deck/ViewFactory',
    'backbone'
],
function(require, ViewFactory, Backbone){

  describe('ViewFactory', function(){

    var viewFactory;
    beforeEach(function(){
      viewFactory = new ViewFactory();
    });
    afterEach(function(){
      viewFactory = undefined;
    });

    describe('handler registration', function(){

      it("should be able to register handlers for various model types", function(){
        viewFactory.addHandler('foo', {});
      });

      it("should throw an error if a handler is already registered for a given type", function(){
        viewFactory.addHandler('foo', {});
        expect(function(){
          viewFactory.addHandler('foo', {});
        }).toThrow();
      });

      it("should be able to unregister handlers for various model types", function(){
        viewFactory.addHandler('foo', {});
        viewFactory.removeHandler('foo');
        viewFactory.addHandler('foo', {});
      });

    });

    describe('view creation', function(){
      it("should be able to create view types it knows how to handle", function(){
        var model = new Backbone.Model({
          type: 'myCustomView'
        });
        var MyCustomView = Backbone.View.extend();
        viewFactory.addHandler('myCustomView', function(options){
          return new MyCustomView(options)
        });
        var createdView = viewFactory.createView({model: model});
        expect(createdView instanceof MyCustomView).toBe(true);
      });

      it("should throw an error if it encounters a view type it doesn't know how to handle", function(){
        expect(function(){
          viewFactory.createModel({type: 'unknownModel'});
        }).toThrow();
      });
    });

  });

});
