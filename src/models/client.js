const mongoose = require("../database");

const ClientSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  sex: { type: String, require: true },
  date_birth: { type: Date, require: false },
  age: { type: Number, require: true },
  city_id: { type: Number, require: true },
  created_at: {type: Date, default: Date.now},
  deleted_at: {type: Date, default: null},
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client 