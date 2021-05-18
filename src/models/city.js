const mongoose = require("../database");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true }
});

const City = mongoose.model('City', CitySchema);

module.exports = City 