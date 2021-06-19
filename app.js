require('dotenv').config();
const express = require("express");
const path = require('path');
const db = require('./db');
const TwitchClient = require('./twitchbot');
const DiscordClient = require('./discordbot');
//const LCDController = require('./lcdcontroller');
const app = express();
const mariadb = require('mariadb/callback');
let mysql  = require('mysql');

var QueueStatus = false;

let config = {
  host    : process.env.DB_IP,
  user    : process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB
};

app.use("/public", express.static(__dirname + "/public"));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin.html'))
});

app.get("/admin/remove", (req, res) => {
  var songId = req.query.id;
  console.log("[  DB  ] Wunsch mit der ID " + songId + " wurde entfernt.");
  db.RemoveFromDatabase(songId);
  res.redirect(301, 'http://192.168.1.100:5000/admin')
});

app.get('/songs', async (req, res) => {
    let con = mysql.createConnection(config);

    con.connect(function(err) {
      if (err) throw err;
      var sql = "SELECT * FROM songrequest ORDER BY id ASC";
      con.query(sql,  function (err, result, fields) {
        if (err) throw err;
        con.end();
        res.send(result);
      });
    });
});

app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
  TwitchClient.Start();
  DiscordClient.Start();
});
