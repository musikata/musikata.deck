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
