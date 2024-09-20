const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  habitat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitat',
  },
  description: {
    type: String,
  },
  healthStatus: {
    type: String,
    default: 'En bonne santé',
  },
});

module.exports = mongoose.model('Animal', AnimalSchema);
