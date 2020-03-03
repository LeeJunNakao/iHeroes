const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const url = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/heroes';

module.exports = mongoose.connect(url,  { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Error.messages.general.required = 'O atributo {PATH} é obrigatório.'