var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Logger = require('./logging')
 
dotenv.config();

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: Number,
  link: String,
});
var gameSchema = new mongoose.Schema({
  name: String,
  price: Number,
  review: reviewSchema,
  genre: String,
  consoles: [String],
});

var Game = mongoose.model('Game', gameSchema);
var Review = mongoose.model('Review', reviewSchema);

var openConnection = async function() {
  await mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    ()  => { Logger.info('Connected to MongoDB'); },
    err => { Logger.error(err); }
  );
}
var closeConnection = async function() {
  await mongoose.disconnect().then(
    ()  => { Logger.info('Disconnected from MongoDB') },
    err => { Logger.error(err); }
  );
}

module.exports = { Game, Review, openConnection, closeConnection };
