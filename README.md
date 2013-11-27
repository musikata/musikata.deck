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

1. a title (optional)
2. a collection of section models.

Each section model represents a view.

The idea is to dispatch on view types (as recorded by a 'type' attribute in the section model). View classes for different types of views are configured through dependency injection. At some point, when we create a deck, we pass it a factory that knows how to create views for various section types. This is what allows for extensibility.

For example, we might do something like this:

<code>
var deckModel = {
  slides: [
    {
      title: 'Title of the First Slide',
      sections: [
        {type: 'html', html: '<p>first slide content</p>'},
        {type: 'myWidget', widgetData: {...}}
      ]
    }
  ]
};

var myViewFactory = new ViewFactory({
  handlers: {
    html: HtmlRenderer,
    myWidget: MyWidgetRenderer,
    ...
  }
});

var deckView = new Deck({
  model: deckModel,
  viewFactory: myViewFactory
});

</code>

We assume that there is some sort of contract that created views fulfill to let their parents know that they are ready. For example, a view may have a deferred object that resolves when it is done initializing. This will allow the parent slide to declare its readiness based on when its child sections are ready.

This will allow us to handle dynamic loading of resources. For example, for loading sound clips for musical exercises without needing to load everything at once.
