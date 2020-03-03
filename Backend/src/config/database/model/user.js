const restful = require('node-restful')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{type: String, required: true },
    email:{type: String, required: true },
    password:{type: String, required: true }
})

module.exports = restful.model('User', UserSchema);