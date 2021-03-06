// We specify specs individually rather than by pattern.
// This makes it easier to switch between branches without
// confusing Karma with missing AMD dependencies.

var specFiles = [
  'CompositeModel.spec.js',
  'CompositeView.spec.js',
  'DeckFactory.spec.js',
  'DeckModel.spec.js',
  'DeckView.spec.js',
  'HtmlView.spec.js',
  'ModelFactory.spec.js',
  'SlideModel.spec.js',
  'ExerciseSlideModel.spec.js',
  'ViewFactory.spec.js',
  'HealthModel.spec.js',
  'HealthView.spec.js',
  'ProgressModel.spec.js',
  'ProgressView.spec.js',
  'ExerciseDeckRunnerModel.spec.js',
  'ExerciseDeckRunnerView.spec.js',
  'MusikataExerciseRunnerModel.spec.js',
  'MusikataExerciseRunnerView.spec.js',
  'ButtonView.spec.js',
  'NavigationView.spec.js',
];

// Prefix specs with specsDir.
var specsDir = 'test/specs';
specFiles.forEach(function(specFile, i){
  specFiles[i] = {
    pattern: specsDir + "/" + specFile,
    watched: true,
    included: false
  };
});

exports.files = specFiles;
