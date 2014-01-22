define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var NavigationView = require('deck/NavigationView');

  /* 
   * Generator functions
   */

  var generateButtonModel = function(opts){
    opts = opts || {};
    opts.id = _.isUndefined(opts.id) ? "b_" + new Date().getTime() : opts.id;
    return new Backbone.Model({
      id: opts.id,
      eventId: _.isUndefined(opts.eventId) ? opts.id : opts.eventId,
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

    return new Backbone.Collection(opts.buttons);
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
        navView.collection.add(generateButtonModel());
        expect(navView.children.length).toEqual(4);
      });

      it('should remove button view when button is removed', function(){
        navView.collection.pop();
        expect(navView.children.length).toEqual(2);
      });

      it('should trigger events when buttons are clicked', function(){
        var triggeredEvents = [];

        navView.on('button:clicked', function(childView, eventId){
          triggeredEvents.push(eventId);
        });
        navView.children.each(function(buttonView){
          buttonView.$el.trigger('click');
        });
        expect(triggeredEvents).toEqual(['a', 'b', 'c']);
      });

    });

  });
});
