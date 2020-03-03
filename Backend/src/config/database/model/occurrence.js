const mongoose = require('mongoose');
const resful = require('node-restful')

const Occurrence = new mongoose.Schema({
    location: {
        lat: { type: String, required: true},
        lng: { type: String, require: true}
    },
    dangerLevel: {type: String, required: true },
    monsterName: {type: String, required: true },
    date: { type: Date, required: true},
    state: { type: String, required: true, enum: ['done','pending','attending'] }
})

module.exports = resful.model('occurrence', Occurrence)