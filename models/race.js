var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raceSchema = new Schema({
  user: String,
  wpm: Number,
  created: {type: Date, default: Date.now},
  textId: String
});

raceSchema.statics.avgWpm = function(name, cb) {
  this.aggregate([
      { $match: { user: name } },
      { $group: {
                  _id: '$user',
                  res: { $avg: '$wpm'}
                }}],
                cb
      );
}

raceSchema.statics.maxWpm = function(name, cb) {
  this.aggregate([
      { $match: { user: name } },
      { $group: {
                  _id: '$user',
                  res: { $max: '$wpm'}
                }}],
                cb
      );
}

raceSchema.statics.races = function(name, cb) {
  this.where({ user: name }).count(cb);
}

module.exports = mongoose.model('Race', raceSchema);
