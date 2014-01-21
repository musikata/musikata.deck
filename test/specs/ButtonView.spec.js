define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var ButtonView = require('deck/ButtonView');

  /* 
   * Generator functions
   */

  var generateButtonModel = function(opts){
    opts.id = _.isUndefined(opts.id) ? "b_" + new Date().getTime() : opts.id;
    return new Backbone.Model({
      id: opts.id,
      label: _.isUndefined(opts.label) ? opts.id : opts.label,
      disabled: _.isUndefined(opts.disabled) ? false : opts.disabled,
    });
  };

  var generateButtonView = function(opts){
    return new ButtonView({
      model: generateButtonModel(opts)
    });
  };

  describe(ButtonView, function(){

    it('should be defined', function(){
      expect(ButtonView).toBeDefined();
    });

    describe('rendering', function(){

      var buttonView;

      afterEach(function(){
        if (buttonView){
          buttonView.remove();
        }
      });

      it('should render label', function(){
        buttonView = generateButtonView({
          label: 'myLabel',
        });
        buttonView.render();
        expect(buttonView.$el.html()).toContain('myLabel');
      });

      it('should update label', function(){
        buttonView = generateButtonView({
          label: 'myLabel',
        });
        buttonView.render();
        expect(buttonView.$el.html()).toContain('myLabel');
        buttonView.model.set('label', 'new label');
        expect(buttonView.$el.html()).toContain('new label');
      });

      it('should reflect initial disabled state', function(){
        buttonView = generateButtonView({
          disabled: false,
        });
        buttonView.render();
        expect(buttonView.$el.attr('disabled')).toBeUndefined();
        buttonView.remove();

        buttonView = generateButtonView({
          disabled: true,
        });
        buttonView.render();
        expect(buttonView.$el.attr('disabled')).toEqual('disabled');
      });

      it('should updatedisabled state', function(){
        buttonView = generateButtonView({
          disabled: false,
        });
        buttonView.render();
        expect(buttonView.$el.attr('disabled')).toBeUndefined();
        buttonView.model.set('disabled', true);
        expect(buttonView.$el.attr('disabled')).toEqual('disabled');
      });

    });

  });
});
