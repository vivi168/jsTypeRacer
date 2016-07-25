var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raceSchema = new Schema({
  user: String,
  wpm: Number,
  created: {type: Date, default: Date.now},
  textId: Number
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

module.exports = mongoose.model('Race', raceSchema);
