const mysql = require('mysql');

let config = {
  host    : process.env.DB_IP,
  user    : process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB
};

function FetchCommandText(command, callback) {
  return new Promise(function(resolve, reject) {
    let con = mysql.createConnection(config);

    con.connect(function(err) {
      if (err) throw err;
      var sql = "SELECT response FROM commands WHERE command = " + mysql.escape(command);
      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        con.end();
        if(result.length === 1)
        {
          resolve(result[0].response);
        } else {
          reject(null);
        }
      });
    });
  });
}

function GetRandomJoke(command, callback) {
  return new Promise(function(resolve, reject) {
    let con = mysql.createConnection(config);

    con.connect(function(err) {
      if (err) throw err;
      var sql = "SELECT response FROM commands WHERE command = " + mysql.escape(command);
      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        con.end();
        if(result.length === 1)
        {
          resolve(result[0].response);
        } else {
          reject(null);
        }
      });
    });
  });
}

function GetJokes() {
  let con = mysql.createConnection(config);

  con.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM jokes";
    con.query(sql,  function (err, result, fields) {
      if (err) throw err;
      con.end();
      return result;
    });
  });
}

function ListSongs() {
  let con = mysql.createConnection(config);

  con.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM songrequest ORDER BY id ASC";
    con.query(sql,  function (err, result, fields) {
      if (err) throw err;
      con.end();
      return result;
    });
  });
}

function AddToQueue(song, username) {
  let con = mysql.createConnection(config);

  con.connect(function(err) {
    if (err) throw err;
    var sql = "INSERT INTO `songrequest` (`Song`, `From`) VALUES ?";
    var values = [
      [song, username]
    ];
    con.query(sql, [values], function (err, result) {
      if(result.affectedRows === 1)
      {
        console.log("[  DB  ] Eintrag von " + username + " - " + song  + " erfolgreich. ");
        con.end();
        return true;
      }
      else
      {
        console.log("[  DB  ] Eintrag von " + username + " - " + song  + " fehlgeschlagen. " + err);
        con.end();
        return false;
      }
    });
  });
}

function RemoveFromDatabase(id) {
  let con = mysql.createConnection(config);

  con.connect(function(err) {
    var sql = "DELETE FROM `songrequest` WHERE Id = " + id + ";";
    con.query(sql, function (err, result) {
      if(result.affectedRows === 1)
      {
        console.log("[  DB  ] Eintrag Nummer " + id + " erfolgreich entfernt.");
      }
      else
      {
        console.log("[  DB  ] Eintrag Nummer " + id + " konnte nicht entfernt werden.");
      }
      con.end();
    });
  });
}

function AddJoke(from, joke) {
  let con = mysql.createConnection(config);

  con.connect(function(err) {
    if (err) throw err;
    var sql = "INSERT INTO `jokes` (`From`, `Joke`) VALUES ?";
    var values = [
      [from, joke]
    ];
    con.query(sql, [values], function (err, result) {
      if(result.affectedRows === 1)
      {
        console.log("[ JOKE ] Eintrag von " + from + " " + joke + " erfolgreich. ");
        con.end();
        return true;
      }
      else
      {
        console.log("[ JOKE ] Eintrag von " + from + " - " + joke  + " fehlgeschlagen. " + err);
        con.end();
        return false;
      }
    });
  });
}

module.exports = {
  FetchCommandText,
  ListSongs,
  AddToQueue,
  RemoveFromDatabase,
  AddJoke
};
