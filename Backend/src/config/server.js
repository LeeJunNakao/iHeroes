const app = require('express')();
const bodyParser = require('body-parser')

const cors = require('./cors')
const openRoutes = require('./routes/openRoutes/routes')
const protectedRoutes = require('./routes/protectedRoutes/routes')

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors)

openRoutes(app);
protectedRoutes(app)

app.listen(PORT, function(){
console.log(`listening on *:${PORT}`);
});


module.exports = app;