define(
  [
    'require',
    'deck/CompositeModel',
    'deck/ModelFactory',
    'backbone'
],
function(require, CompositeModel, ModelFactory, Backbone){

  ddescribe('CompositeModel', function(){

    var modelFactory = new ModelFactory();
    modelFactory.addHandler('model', Backbone.Model);

    describe('parsing', function(){
      it('should parse a nested definition', function(){
        var definition = {
          type: 'composite',
          children: [
            {type: 'model', data: 'first child'},
            {type: 'model', data: 'second child'}
          ]
        };
        var compositeModel = new CompositeModel(definition, {parse: true, modelFactory: modelFactory});
        var parsedChildren = compositeModel.get('children');
        expect(parsedChildren instanceof Backbone.Collection).toBe(true);
        expect(parsedChildren.length).toBe(2);
      });
    });

  });

});
