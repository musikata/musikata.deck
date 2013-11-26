require.config({
  paths: {
    text: 'bower_components/requirejs-text/text',
    jquery: 'bower_components/jquery/jquery',
    backbone: 'bower_components/backbone/backbone',
    underscore: 'bower_components/underscore/underscore',
    marionette: 'bower_components/marionette/bower_components/backbone.marionette',
    handlebars: 'bower_components/handlebars/handlebars',
  },

  packages: [
    {name: 'deck', location: 'src'}
  ],

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'marionette': {
      deps: ['backbone'],
      exports: 'Backbone.Marionette'
    },

    'handlebars': {
      exports: 'Handlebars'
    },

  }
});
