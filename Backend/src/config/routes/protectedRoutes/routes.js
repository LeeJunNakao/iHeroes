const auth = require('../../auth/auth');
const express = require('express')
const Hero = require('../../database/model/heroService')
const Occurrence = require('../../database/model/ocurrenceService')

module.exports = (app)=>{
    const protectedAPI = express.Router();

    protectedAPI.use(auth);
    app.use('/api',protectedAPI);

    Hero.register(protectedAPI,'/hero');
    Occurrence.register(protectedAPI, '/occurrence')
}