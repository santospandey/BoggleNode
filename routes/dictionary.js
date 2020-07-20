var express = require('express');
var router = express.Router();

router.get('/:word', function (req, res, next) {
  let dictionary = req.app.locals.dictionary;  
  let upperCase = req.params.word.toUpperCase();  
  let data = {
    word: req.params.word,
    isTrue: !!dictionary[upperCase]
  }
  res.send(data);
});

module.exports = router;
