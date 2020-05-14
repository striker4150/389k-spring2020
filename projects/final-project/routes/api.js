var express = require('express');
var router = express.Router();

var { Game, Review } = require('../utils/db');
var Logger = require('../utils/logging');

router.get('/getGames', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
      if(err) return Logger.error(err);
      res.json(gameData);
  });
})

router.post('/addGame', function (req, res) {
  var requestReview = { author: req.body.review_author, rating: parseFloat(req.body.review_rating), link: req.body.review_url }
  console.log(requestReview);
  var requestGame = { name: req.body.name, price: parseFloat(req.body.price), review: requestReview, genre: req.body.genre, consoles: req.body.consoles }
  // Validate the data
  if(typeof(requestGame.name) === 'string' &&
     typeof(requestGame.price) === 'number' && isFinite(requestGame.price) &&
     typeof(requestReview.rating) === 'number' && isFinite(requestReview.rating) &&
     typeof(requestGame.genre) === 'string' &&
     Array.isArray(requestGame.consoles) && requestGame.consoles.length != 0 && typeof(requestGame.consoles[0]) === 'string') {
      // Deny request if the price is negative
      if(!(requestGame.price >= 0)) { return res.status(400).send("Price cannot be negative"); }
      // Deny request if the rating is not between 1 and 10
      if(!(requestReview.rating >= 1 && requestReview.rating <= 10)) { return res.status(400).send("Rating has to be between 1 and 10"); }
      // Deny request if the game already exists
      Game.findOne({ name: requestGame.name }, function(err, game) {
        if(err) return res.status(409).send("Game already exists");
      });
      var newGame = new Game(requestGame);
      newGame.save(function(err, game) {
        if(err) Logger.error(err);
      });
      res.json(requestGame);
  } else {
      res.sendStatus(400);
  }
})

module.exports = router;
