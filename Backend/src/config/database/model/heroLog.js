const mongoose = require('mongoose');
const resful = require('node-restful')

const HeroLog = new mongoose.Schema({
    hero: { 
        id: {type: String, required: true },
        name: {type: String, required: true }
     },
    avaible: {type: Boolean, required: true },
    date: { type: Date, required: true},
    occurrence: { type: mongoose.ObjectId, required: true }
})

module.exports = resful.model('herolog', HeroLog)