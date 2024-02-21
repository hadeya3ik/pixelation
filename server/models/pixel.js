const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PixelSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  R: { type: Number, required: true },
  G: { type: Number, required: true },
  B: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pixel', PixelSchema);
