var express = require('express'),
    http = require('http');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var file = 'database.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var app = express();


var server = http.createServer(app);


server.listen(1337);

db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS race (id INTEGER PRIMARY KEY NOT NULL,\
                                              user TEXT NOT NULL,\
                                              wpm REAL NOT NULL,\
                                              textid INTEGER NOT NULL,\
                                              date TEXT NOT NULL)");
});

app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/login', function(req, res){
    console.log(req.body);
    req.session.username = req.body.username;
    res.send(req.body.username);
});

app.post('/checklogin', function(req, res){
    if(req.session.username) {
        res.send(req.session.username);
    }
    else {
        res.send(false);
    }
});

app.post('/saverace', function(req, res){
    console.log(req.body);
    console.log(req.session.username);

    if(req.session.username) {
        var stmt = db.prepare("INSERT INTO race (user, wpm, textid, date) VALUES(?, ?, ?, datetime('now'))");
        stmt.run(req.session.username, req.body.wpm, req.body.textid);
        stmt.finalize();
        console.log('race saved ' + req.session.username + ' score:' + req.body.wpm);

        res.send(true);
    }
    else
        res.send(false);
});

app.get('/', function(req, res){
    res.render('index.ejs');

});
app.get('/stats', function(req, res){
    res.render('stats.ejs');
});

app.use("/js", express.static(__dirname + "/js"));
app.use("/style", express.static(__dirname + "/style"));


