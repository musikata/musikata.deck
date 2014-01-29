define(function(require){
  var CompositeModel = require('deck/CompositeModel');
  var ModelFactory = require('deck/ModelFactory');
  var Backbone = require('backbone');

  describe('CompositeModel', function(){

    var modelFactory = new ModelFactory();
    modelFactory.addHandler('model', Backbone.Model);
    modelFactory.addHandler('composite', CompositeModel);

    describe('parsing', function(){
      it('should parse a nested definition', function(){
        var definition = {
          type: 'composite',
          children: [
            {type: 'model', data: 'left'},
            {type: 'composite', data: 'right', children: [
              {type: 'model', data: 'right.left'},
              {type: 'model', data: 'right.right'},
            ]}
          ]
        };
        var compositeModel = new CompositeModel(definition, {parse: true, modelFactory: modelFactory});
        var parsedChildren = compositeModel.get('children');
        expect(parsedChildren instanceof Backbone.Collection).toBe(true);
        expect(parsedChildren.length).toBe(2);

        var nestedComposite = parsedChildren.at(1);
        expect(nestedComposite instanceof CompositeModel).toBe(true);
        var parsedGrandChildren = nestedComposite.get('children');
        expect(parsedGrandChildren instanceof Backbone.Collection).toBe(true);
        expect(parsedGrandChildren.length).toBe(2);
      });
    });

  });

});
