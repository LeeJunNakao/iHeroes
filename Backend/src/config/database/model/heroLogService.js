const HeroLog = require('./heroLog')

HeroLog.methods(['get']);
HeroLog.updateOptions({new: true, runValidators: true});

module.exports = HeroLog;