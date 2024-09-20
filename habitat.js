const mongoose = require('mongoose');

const HabitatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  animals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
    },
  ],
});

module.exports = mongoose.model('Habitat', HabitatSchema);
