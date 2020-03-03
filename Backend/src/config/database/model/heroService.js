const Hero = require('./hero');

Hero.methods(['get','post','put','delete']);
Hero.updateOptions({new: true, runValidators: true});

module.exports = Hero;