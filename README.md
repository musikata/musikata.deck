# musikata.deck

musikata.deck is a library for creating slide decks.

## Intent
musikata.deck is intended to be used for the presentation of musical lessons and exercises as a series of slides.

These lessons and exercises will be defined as JSON objects.

Exercises can be presented as 'ExerciseDecks', which consist of a set of exercise slides combined with a scoring mechanism.

Lessons can be presented as 'InfoDecks', which consist only of slides with no scoring mechanism.

## Extensibility
The goal for musikata.deck is to create a library that can be extended to present many different types of slides.

For example, we would like to create a renderer that presents a musical rhythm exercise on a slide.

With this in mind the Deck is responsible just for the navigation between slides, and not the rendering of the slides themselves.

## What is a slide?
A slide consists of:

1. common slide parameters (e.g. title, id, type)
2. type-specific parameters

The idea is to handle different types of slides through factory methods. (If this sounds complicated, don't worry, there's an example coming below). The factory methods will dispatch on types (as recorded by a 'type' attribute in the slide definition). Classes for different types of views are configured through dependency injection, by way of plugin registration. This is what allows for extensibility.

For example, we might do something like this:

<code></pre>
var deckDefinition = {
  slides: [
  
    // First slide.
    {
      title: 'First Slide',
      type: 'html',
      parameters: {
        html: "<p>I'm the first slide.</p>"
      }
    },

    // Second slide.
    {
      title: 'Second Slide',
      type: 'myCustomType', 
      parameters: {
        someCustomParameter: {...},
        anotherCustomParameter: {...}
      }
    }
  ]
};

var deckFactory = new DeckFactory();
deckFactory.modelFactory.addHandler('myCustomType', MyCustomModel);
deckFactory.viewFactory.addHandler('myCustomType', MyCustomView);

var deckView = deckFactory.createDeckFromDefinition(deckDefinition);

</pre></code>

Individual slides are responsible for letting the deck know when they are ready. For example, a slide might have a deferred object that resolves when it is done initializing.

This will allow us to handle dynamic loading of resources. For example, for loading sound clips for musical exercises without needing to load everything at once.
