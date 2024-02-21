var express = require('express');
var router = express.Router();
const Pixel = require('../models/pixel');// Adjust the path to where you save the model
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler'); // Assuming you have this middleware for handling exceptions in async functions.

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

// GET request for one pixel.
router.get("/:id", async (req, res, next) => {
  try {

    const pixel = await Pixel.findById(req.params.id).exec();

    if (!pixel) {
      const err = new Error("Pixel not found");
      err.status = 404;
      return next(err);
    }

    res.json({
      x: pixel.x,
      y: pixel.y,
      r: pixel.r,
      g: pixel.g,
      b: pixel.b,
    });
  } catch (error) {
    next(error);
  }
});

// GET request to update pixel.
router.get("/:id/update", async (req, res, next) => {
  try {
    const pixel = await Pixel.findById(req.params.id).exec();

    if (!pixel) {
      const err = new Error("Pixel not found");
      err.status = 404;
      return next(err);
    }

    res.json({ 
      action: "updating",
      x: pixel.x,
      y: pixel.y,
      r: pixel.r,
      g: pixel.g,
      b: pixel.b,
    });
  } catch (error) {
    next(error);
  }
});

// POST request to update Pixel's color.
router.put("/:id/update", [
  // Validate and sanitize RGB fields.
  body('r', 'R (red) value must be between 0 and 255.').trim().isInt({ min: 0, max: 255 }).toInt(),
  body('g', 'G (green) value must be between 0 and 255.').trim().isInt({ min: 0, max: 255 }).toInt(),
  body('b', 'B (blue) value must be between 0 and 255.').trim().isInt({ min: 0, max: 255 }).toInt(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Prepare the update data with only RGB values.
    const pixelUpdateData = {
      r: req.body.r,
      g: req.body.g,
      b: req.body.b,
    };

    try {
      // Attempt to update the pixel with provided id.
      const updatedPixel = await Pixel.findByIdAndUpdate(req.params.id, pixelUpdateData, { new: true });

      if (!updatedPixel) {
        // No pixel found with the given id.
        res.status(404).json({ message: "Pixel not found" });
        return;
      }

      // Successfully updated the pixel's color.
      res.json(updatedPixel);
    } catch (error) {
      // Handle possible errors.
      next(error);
    }
  }),
]);

module.exports = router;
