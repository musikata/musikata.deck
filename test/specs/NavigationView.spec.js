define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var NavigationView = require('deck/NavigationView');

  /* 
   * Generator functions
   */

  var generateButtonModel = function(opts){
    return new Backbone.Model({
      id: opts.id,
      label: _.isUndefined(opts.label) ? opts.id : opts.label,
      disabled: _.isUndefined(opts.disabled) ? false : opts.disabled,
    });
  };

  var generateButtonCollection = function(overrides){
    var opts = _.extend({
      buttons: _.map(['a', 'b', 'c'], function(id){
        return generateButtonModel({id: id});
      })
    }, overrides);
  };

  var generateNavigationView = function(overrides){
    var opts = _.extend({
      buttonCollection: generateButtonCollection()
    }, overrides);

    return new NavigationView({
      collection: opts.buttonCollection
    });
  };

  describe(NavigationView, function(){

    it('should be defined', function(){
      expect(NavigationView).toBeDefined();
    });

    describe('rendering', function(){

      var navView;
      beforeEach(function(){
        navView = generateNavigationView();
        navView.render();
      });

      afterEach(function(){
        navView.remove();
      });

      it('should render buttons', function(){
        expect(navView.children.length).toEqual(3);
      });

      it('should add button view when button is added', function(){
        this.fail('NOT IMPLEMENTED');
      });

      it('should remove button view when button is removed', function(){
      });

    });

  });
});
