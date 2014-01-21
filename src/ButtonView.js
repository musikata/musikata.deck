define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ButtonView = Marionette.ItemView.extend({
    tagName: 'button',

    template: Handlebars.compile('<span class="label"></span>'),

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

    updateLabel: function(){
      $(this.ui.label).html(this.model.get('label'));
    },

    updateDisabled: function(){
      this.$el.attr('disabled', this.model.get('disabled'));
    }
  });

  return ButtonView;
});
