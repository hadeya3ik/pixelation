const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PixelSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  r: { type: Number, required: true },
  g: { type: Number, required: true },
  b: { type: Number, required: true },
});

PixelSchema.virtual("url").get(function () {
  return `/pixels/${this._id}`;
});

module.exports = mongoose.model('Pixel', PixelSchema);
