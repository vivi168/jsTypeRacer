var express = require('express'),
    http = require('http');
var session = require('express-session')
var bodyParser = require('body-parser');

var fs = require('fs');
var file = 'database.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(1337);

db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS race (id INTEGER PRIMARY KEY NOT NULL,\
                                              user TEXT NOT NULL,\
                                              wpm REAL NOT NULL,\
                                              textid INTEGER NOT NULL,\
                                              date TEXT NOT NULL)");
});

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
    res.send(req.body.username);
})

app.get('/', function(req, res){
    res.render('index.ejs');

});
app.get('/stats', function(req, res){
    res.render('stats.ejs');
});

app.use("/js", express.static(__dirname + "/js"));
app.use("/style", express.static(__dirname + "/style"));

io.sockets.on('connection', function(socket){

    socket.on('saveRace', function(data){
        var db = new sqlite3.Database(file);
        var stmt = db.prepare("INSERT INTO race (user, wpm, textid, date) VALUES(?, ?, ?, datetime('now'))");
        stmt.run(data.user, data.wpm, data.textid);
        stmt.finalize();
        console.log('race saved ' + data.user + ' score:' + data.wpm);
    });

});

