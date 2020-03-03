const Occurrence = require('./occurrence')

Occurrence.methods(['get','post','put','delete']);
Occurrence.updateOptions({new: true, runValidators: true});

module.exports = Occurrence;