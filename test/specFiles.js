// We specify specs individually rather than by pattern.
// This makes it easier to switch between branches without
// confusing Karma with missing AMD dependencies.

var specFiles = [
  'CompositeModel.spec.js',
  'CompositeView.spec.js',
  'BaseDeckFactory.spec.js',
  'BaseDeckModel.spec.js',
  'DeckViewCommon.js',
  'HtmlView.spec.js',
  'ModelFactory.spec.js',
  'SlideModel.spec.js',
  'ViewFactory.spec.js',
  'ExerciseDeckViewCommon.js',
  'ExerciseDeckView.spec.js',
  'ExerciseDeckModel.spec.js',
  'HealthModel.spec.js',
  'HealthView.spec.js',
  'ExerciseDeckRunner.spec.js',
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
