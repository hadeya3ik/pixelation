var express = require('express');
var router = express.Router();
const Pixel = require('../models/pixel');// Adjust the path to where you save the model

router.get('/', async function(req, res, next) {
  try {
    const pixel = await Pixel.find();
    res.json( { pixel });
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  const x = req.body.x;
  const y = req.body.y;
  const r = req.body.r;
  const g = req.body.g;
  const b = req.body.b;

  const pixel = new Pixel({
      x: x,
      y: y, 
      r: r, 
      g: g, 
      b: b, 
  });

  try {
      await pixel.save();
      res.redirect('/');
  } catch (err) {
      next(err);
  }
});

router.put('/:x-:y', async function(req, res, next) {
  const { x, y } = req.params;
  const { r, g, b } = req.body;

  try {
    const updatedPixel = await Pixel.findOneAndUpdate({ x, y }, { $set: { r, g, b } }, { new: true });
    if (updatedPixel) {
      res.json(updatedPixel);
    } else {
      res.status(404).send("Pixel not found");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
