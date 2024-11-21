const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  assignEmail: { type: String, required: true },
  dayIndex: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Data', dataSchema);
