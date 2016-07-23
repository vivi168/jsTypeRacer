var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RaceSchema = new Schema({
  user: String,
  wpm: Number,
  textId: Number
});

module.exports = mongoose.model('Race', RaceSchema);