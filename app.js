var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jsTypeRacer');
var models = require('./models');

var async = require('async');

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
  async.parallel({
    avgWpm: (cb) => {
      models.Race.avgWpm(req.ip, cb);
    },
    maxWpm: (cb) => {
      models.Race.maxWpm(req.ip, cb);
    },
    races: (cb) => {
      models.Race.races(req.ip, cb);
    }
  },
  (err, results) => {
    if(err) {
      console.log(err);
    } else {
      console.log(results);
      res.render('stats.ejs', {guest_ip: req.ip, stats: results});
    }
  });
});

app.post('/race', (req, res) => {
  var race = new models.Race(req.body);
  race.save((err) => {
    if(err) {
      res.send(err);
    } else {
      res.send('race saved');
    }
  });
});

app.listen(1337, '0.0.0.0');
