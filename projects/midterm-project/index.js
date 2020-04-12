var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var fs = require('fs');
var _ = require("underscore");

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/", helpers: {
    formatMoney: function (money) { return '$' + money.toFixed(2).toLocaleString(); },
    formatArray: function (array) { return array.join(', '); }
}}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

// restoreOriginalData();

var gameData = loadData().games;

app.get('/', function (req, res) {
    res.render('table', { data: gameData, games: true, active: { home: true } });
})

app.get('/addGame', function (req, res) {
    res.render('form', { active: { new: true } });
})

app.post('/addGame', function (req, res) {
    var requestGame = { name: req.body.name, price: parseFloat(req.body.price), rating: parseFloat(req.body.rating), genre: req.body.genre, consoles: req.body.consoles.split(", ") }
    // Validate the data
    if(typeof(requestGame.name) === 'string' &&
       typeof(requestGame.price) === 'number' && isFinite(requestGame.price) &&
       typeof(requestGame.rating) === 'number' && isFinite(requestGame.rating) &&
       typeof(requestGame.genre) === 'string' &&
       Array.isArray(requestGame.consoles) && requestGame.consoles.length != 0 && typeof (requestGame.consoles[0]) === 'string') {
        // Deny request if the game already exists
        if(_.contains(_.pluck(gameData, 'name'), requestGame.name)) { return res.render('form', { error: true, conflict: true, active: { new: true } }); }
        // Deny request if the price is negative
        if(!(requestGame.price >= 0)) { return res.render('form', { error: true, price: true, active: { new: true } }); }
        // Deny request if the rating is not between 1 and 10
        if(!(requestGame.rating >= 1 && requestGame.rating <= 10)) { return res.render('form', { error: true, rating: true, active: { new: true } }); }
        gameData.push(requestGame);
        saveData(gameData);
        res.render('form', { active: { new: true } });
    } else {
        return res.render('form', { error: true, invalid: true, active: { new: true } });
    }
})

app.get('/alphabetical', function (req, res) {
    var sortedGames = _.sortBy(gameData, function(game) { return game.name.toLowerCase(); });
    res.render('table', { data: sortedGames, games: true, active: { alphabetical: true } });
})

app.get('/free', function (req, res) {
    var freeGames = _.where(gameData, { price: 0 });
    res.render('table', { data: freeGames, games: true, active: { free: true } });
})

app.get('/highest_rated', function (req, res) {
    var sortedGames = _.sortBy(gameData, function(game) { return game.rating; }).reverse();
    res.render('table', { data: sortedGames, games: true, active: { highest_rated: true } });
})

app.get('/genre', function (req, res) {
    var genres = _.uniq(_.pluck(gameData, 'genre'));
    res.render('table', { data: genres, category: "genre", active: { genre: true } });
})

app.get('/genre/:genre_type', function (req, res) {
    var genreGames = _.filter(gameData, function(game) { return game.genre === req.params.genre_type; });
    res.render('table', { data: genreGames, games: true, active: { genre: true } });
})

app.get('/console', function (req, res) {
    var consoles = _.reduce(gameData, function(consoleList, game) { return _.union(consoleList, game.consoles); }, []);
    res.render('table', { data: consoles, category: "console", active: { console: true } });
})

app.get('/console/:console_name', function (req, res) {
    var consoleGames = _.filter(gameData, function(game) { return _.contains(game.consoles, req.params.console_name); });
    res.render('table', { data: consoleGames, games: true, active: { console: true } });
})

app.get('/api/getGames', function (req, res) {
    res.json(gameData);
})

app.post('/api/addGame', function (req, res) {
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

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000');
});

function restoreOriginalData() {
    fs.writeFileSync('games.json', fs.readFileSync('games_original.json'));
}

function loadData() {
    return JSON.parse(fs.readFileSync('games.json'));
}

function saveData(data) {
    var obj = {
        games: data
    };

    fs.writeFileSync('games.json', JSON.stringify(obj));
}
