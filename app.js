var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jsTypeRacer');
var models = require('./models');

var express = require('express');
var bodyParser= require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs', {guest_ip: req.ip});
});

app.get('/stats', (req, res) => {
  models.Race.aggregate(
    [
      { $match: { user: req.ip } },
      { $group: {
        _id: '$user',
        avgWpm: { $avg: '$wpm'}
      }}
    ],
    function (err, results) {
      if(err) throw err;
      console.log(results);
      res.render('stats.ejs', {guest_ip: req.ip, stats: results});
    }
  );

});

app.post('/race', (req, res) => {
  console.log(req.body);
  var race = new models.Race(req.body);
  race.save((err) => {
    if(err) throw err;
    res.json({status:"race saved"});
  });
});

app.listen(1337, '0.0.0.0');