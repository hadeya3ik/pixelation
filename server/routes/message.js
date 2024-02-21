var express = require('express');
var router = express.Router();
const Message = require('../models/messages');// Adjust the path to where you save the model

router.get('/', async function(req, res, next) {
  try {
    const messages = await Message.find();
    res.json( { messages });
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req, res, next) {
  const author = req.body.author;
  const messageText = req.body.messageText;

  const message = new Message({
      text: messageText,
      user: author
  });

  try {
      await message.save();
      res.redirect('/');
  } catch (err) {
      next(err);
  }
});

module.exports = router;
