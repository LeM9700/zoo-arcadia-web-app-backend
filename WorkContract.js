const mongoose = require('mongoose');

const WorkContractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'veterinarian', 'employee'],  // Spécifie le rôle pour chaque contrat
    required: true,
  }
});

module.exports = mongoose.model('WorkContract', WorkContractSchema);
