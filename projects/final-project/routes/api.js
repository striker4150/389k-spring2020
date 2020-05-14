var express = require('express');
var router = express.Router();

app.get('/getGames', function (req, res) {
  res.json(gameData);
})

app.post('/addGame', function (req, res) {
  var requestGame = { name: req.body.name, price: parseFloat(req.body.price), rating: parseFloat(req.body.rating), genre: req.body.genre, consoles: req.body.consoles }
  // Validate the data
  if(typeof(requestGame.name) === 'string' &&
     typeof(requestGame.price) === 'number' && isFinite(requestGame.price) &&
     typeof(requestGame.rating) === 'number' && isFinite(requestGame.rating) &&
     typeof(requestGame.genre) === 'string' &&
     Array.isArray(requestGame.consoles) && requestGame.consoles.length != 0 && typeof(requestGame.consoles[0]) === 'string') {
      // Deny request if the game already exists
      if(_.contains(_.pluck(gameData, 'name'), requestGame.name)) { return res.status(409).send("Game already exists"); }
      // Deny request if the price is negative
      if(!(requestGame.price >= 0)) { return res.status(400).send("Price cannot be negative"); }
      // Deny request if the rating is not between 1 and 10
      if(!(requestGame.rating >= 1 && requestGame.rating <= 10)) { return res.status(400).send("Rating has to be between 1 and 10"); }
      gameData.push(requestGame);
      saveData(gameData);
      res.json(requestGame);
  } else {
      res.sendStatus(400);
  }
})

module.exports = router;
