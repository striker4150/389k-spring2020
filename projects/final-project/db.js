var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Logger = require('./logging')
 
dotenv.config();
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', (err) => {
  Logger.error(err);
});
db.once('open', function() {
  Logger.info('Connected to MongoDB')
});

var close = function() {
  mongoose.disconnect();
  Logger.info('Disconnected from MongoDB')
}

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

module.exports = [Game, Review, close];
