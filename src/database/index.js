const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/clients', { useNewUrlParser: true,  useUnifiedTopology: true})
mongoose.Promise = global.Promise;

module.exports = mongoose;