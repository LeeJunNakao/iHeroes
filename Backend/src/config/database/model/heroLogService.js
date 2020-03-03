const HeroLog = require('./heroLog')

HeroLog.methods(['get','post','put','delete']);
HeroLog.updateOptions({new: true, runValidators: true});

module.exports = HeroLog;