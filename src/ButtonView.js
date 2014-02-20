define(function(require){
  var Marionette = require('marionette');

  var ButtonView = Marionette.ItemView.extend({
    tagName: 'button',

    template: function(){return '';},
    events: {
      "click": "_onClick"
    },

    modelEvents: {
      "change:label": "updateLabel",
      "change:disabled": "updateDisabled",
    },

    ui: {
      label: '.label'
    },

    onRender: function(){
      this.$el.data('id', this.model.get('id'));
      this.updateLabel();
      this.updateDisabled();
    },

    _onClick: function(){
      this.trigger('clicked', this.model.get('eventId'));
    },

    updateLabel: function(){
      this.$el.html(this.model.get('label'));
    },

    updateDisabled: function(){
      this.$el.attr('disabled', this.model.get('disabled'));
    }
  });

  return ButtonView;
});
