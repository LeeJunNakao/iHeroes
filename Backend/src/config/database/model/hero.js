const mongoose = require('mongoose')
const restful = require('node-restful')

const Hero = new mongoose.Schema({
    name: { type: String, required: true},
    class: { type: String, required: true, uppercase: true, enum: ['S','A','B','C']},
    avaible: {type: Boolean, required: true, default: true}
})

module.exports = restful.model('Hero', Hero);