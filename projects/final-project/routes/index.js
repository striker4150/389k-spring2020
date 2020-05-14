var express = require('express');
var router = express.Router();

var _ = require('lodash');

var { Game, Review } = require('../utils/db');
var Logger = require('../utils/logging');

router.get('/', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    res.render('table', { data: gameData, games: true, active: { home: true } });
  });
})

router.get('/addGame', function (req, res) {
  res.render('form', { active: { new: true } });
})

router.post('/addGame', function (req, res) {
  var requestGame = { name: req.body.name, price: parseFloat(req.body.price), reviews: [], genre: req.body.genre, consoles: req.body.consoles.split(", ") }
  // Validate the data
  if(typeof(requestGame.name) === 'string' &&
     typeof(requestGame.price) === 'number' && isFinite(requestGame.price) &&
     typeof(requestGame.genre) === 'string' &&
     Array.isArray(requestGame.consoles) && requestGame.consoles.length != 0 && typeof (requestGame.consoles[0]) === 'string') {
      // Deny request if the price is negative
      if(!(requestGame.price >= 0)) { return res.render('form', { error: true, price: true, active: { new: true } }); }
      // Deny request if the game already exists
      Game.findOne({ name: requestGame.name }, function(err, game) {
        if(err) res.render('form', { error: true, conflict: true, active: { new: true } });
      });
      var newGame = new Game(requestGame);
      newGame.save(function(err, game) {
        if(err) Logger.error(err);
      });
      res.render('form', { active: { new: true } });
  } else {
      return res.render('form', { error: true, invalid: true, active: { new: true } });
  }
})

router.get('/alphabetical', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var sortedGames = _.sortBy(gameData, function(game) { return game.name.toLowerCase(); });
    res.render('table', { data: sortedGames, games: true, active: { alphabetical: true } });
  });
})

router.get('/free', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var freeGames = _.filter(gameData, { price: 0 });
    res.render('table', { data: freeGames, games: true, active: { free: true } });
  });
})

router.get('/highest_rated', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var sortedGames = _.orderBy(gameData, function(game) { return game.rating; 'desc'}, );
    res.render('table', { data: sortedGames, games: true, active: { highest_rated: true } });
  });
})

router.get('/genre', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var genres = _.uniq(_.map(gameData, 'genre'));
    res.render('table', { data: genres, category: "genre", active: { genre: true } });
  });
})

router.get('/genre/:genre_type', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var genreGames = _.filter(gameData, function(game) { return game.genre === req.params.genre_type; });
    res.render('table', { data: genreGames, games: true, active: { genre: true } });
  });
})

router.get('/console', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var consoles = _.reduce(gameData, function(consoleList, game) { return _.union(consoleList, game.consoles); }, []);
    res.render('table', { data: consoles, category: "console", active: { console: true } });
  });
})

router.get('/console/:console_name', function (req, res) {
  Game.find({}).lean().exec(function(err, gameData) {
    if(err) return Logger.error(err);
    var consoleGames = _.filter(gameData, function(game) { return _.includes(game.consoles, req.params.console_name); });
    res.render('table', { data: consoleGames, games: true, active: { console: true } });
  });
})

module.exports = router;
