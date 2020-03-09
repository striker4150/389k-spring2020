var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    // HINT: 
    // var contents = "";
    // _.each(_DATA, function(i) {
    //     contents += `<tr><td>1</td><td><a href="/pokemon/1">Nelson</a></td></tr>\n`;
    // })
    // var html = `<html>\n<body>\n<table>CONTENTS</table>\n</body>\n</html>`;
    // res.send(html);
    var contents = "";
    _.each(_DATA, function(i) {
        contents += `\n\t\t<tr><td>${i.id}</td><td><a href="/pokemon/${i.id}">${i.name}</a></td></tr>`;
    });
    var html = `<html>\n<body>\n\t<table>${contents}\n\t</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    var pokemon = _.findWhere(_DATA, { id: parseInt(req.params.pokemon_id) });
    if (!pokemon) return res.status(404).send("Error: Pokemon not found");
    var contents = "";
    _.each(pokemon, function(val, key) {
        contents += `\n\t\t<tr><td>${key}</td><td>${JSON.stringify(val)}</td></tr>`;
    });
    var html = `<html>\n<body>\n\t<table>${contents}\n\t</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var pokemon = _.findWhere(_DATA, { id: parseInt(req.params.pokemon_id) });
    if (!pokemon) return res.status(404).send("Error: Pokemon not found");
    var url = `http://www.serebii.net/pokemongo/pokemon/${pokemon.num}.png`;
    var html = `<html>\n<body>\n\t<img src="${url}">\n</body>\n</html>`;
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var pokemon = _.findWhere(_DATA, { name: req.params.pokemon_name });
    if (!pokemon) return res.json([]);
    var evochain = _.union([pokemon.name], _.pluck(pokemon.prev_evolution, "name"), _.pluck(pokemon.next_evolution, "name"));
    res.json(evochain.sort());
});

app.get("/api/type/:type", function(req, res) {
    var pokemon = _.filter(_DATA, function(i) { return _.contains(i.type, req.params.type); });
    if (pokemon.length == 0) return res.json([]);
    res.json(_.pluck(pokemon, "name"));
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var pokemon = _.filter(_DATA, function(i) { return _.contains(i.type, req.params.type); });
    if (pokemon.length == 0) return res.json({});
    pokemon = _.max(pokemon, function(i) { return parseFloat(i.weight); });
    res.json({ name: pokemon.name, weight: parseFloat(pokemon.weight) });
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var pokemon = _.findWhere(_DATA, { name: req.params.pokemon_name });
    if (!pokemon) return res.json({});
    if (!_.contains(pokemon.weaknesses, req.params.weakness_name)) {
        pokemon.weaknesses.push(req.params.weakness_name);
    }
    pokeDataUtil.saveData(_DATA);
    res.json({ name: pokemon.name, weaknesses: pokemon.weaknesses });
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var pokemon = _.findWhere(_DATA, { name: req.params.pokemon_name });
    if (!pokemon) return res.json({});
    pokemon.weaknesses = _.without(pokemon.weaknesses, req.params.weakness_name);
    pokeDataUtil.saveData(_DATA);
    res.json({ name: pokemon.name, weaknesses: pokemon.weaknesses });
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
