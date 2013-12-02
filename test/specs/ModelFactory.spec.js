define(
  [
    'require',
    'deck/ModelFactory',
    'backbone'
],
function(require, ModelFactory, Backbone){

  ddescribe('ModelFactory', function(){

    var modelFactory;
    beforeEach(function(){
      modelFactory = new ModelFactory();
    });
    afterEach(function(){
      modelFactory = undefined;
    });

    describe('handler registration', function(){

      it("should be able to register handlers for various model types", function(){
        modelFactory.addHandler({type: 'foo', handler: function(){}});
      });

      it("should throw an error if a handler is already registered for a given type", function(){
        modelFactory.addHandler({type: 'foo', handler: function(){}});
        expect(function(){
          modelFactory.addHandler({type: 'foo', handler: function(){}});
        }).toThrow();
      });

      it("should be able to unregister handlers for various model types", function(){
        modelFactory.addHandler({type: 'foo', handler: function(){}});
        modelFactory.removeHandler({type: 'foo'});
        modelFactory.addHandler({type: 'foo', handler: function(){}});
      });

    });

    describe('model parsing', function(){
      it("should be able to create model types it knows how to handle", function(){
        var MyCustomModel = Backbone.Model.extend();
        modelFactory.addHandler({type: 'myCustomModel', handler: MyCustomModel});
        var createdModel = modelFactory.createModel({type: 'myCustomModel'});
        expect(createdModel instanceof MyCustomModel).toBe(true);
      });

      it("should throw an error if it encounters a model type it doesn't know how to handle", function(){
        expect(function(){
          modelFactory.createModel({type: 'unknownModel'});
        }).toThrow();
      });
    });

  });

});
