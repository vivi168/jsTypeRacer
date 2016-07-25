var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

var textSchema = new Schema({
  text: String
});
textSchema.plugin(random);

var Text = mongoose.model('Text', textSchema);

var file = path.join(__dirname, 'texts.json');

Text.findOne({}, (err, doc) => {
  if(!doc){
    console.log('initializing texts list...');
    fs.readFile(file,'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var texts = JSON.parse(data);
        texts.forEach((text) => {
          var text = new Text(text)
          text.save((err, doc) => {});
        });
      }
    });
  }
});

module.exports = Text;