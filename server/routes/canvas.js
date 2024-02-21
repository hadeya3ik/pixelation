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

router.post('/updatePixel', async function(req, res, next) {
    const { x, y, R, G, B } = req.body;
  
    try {
      const updatedPixel = await Pixel.findOneAndUpdate(
        { x, y }, // find a document with matching x and y
        { R, G, B, updatedAt: Date.now() }, // update these fields
        { new: true, upsert: true } // options: return new doc and insert if doesn't exist
      );
      res.json(updatedPixel);
    } catch (error) {
      next(error);
    }
  });
  

module.exports = router;
