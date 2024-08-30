const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  sand: { type: Number },
  rocks: { type: Number },
  cement: { type: Number },
  lotNumber: { type: Number, required: true },
  isInactive: { type: Boolean },
  reason: { type: String } // Add this field
}, {
  collection: 'materials'  // Specify the collection name
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
