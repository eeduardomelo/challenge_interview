const express = require("express");
const bodyParser =  require('body-parser')

const port = 3000
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


require('./controllers/clientController')(app)
require('./controllers/cityController')(app)

app.listen(port)
console.log(`Server started on port ${port} at ${new Date()}`)
