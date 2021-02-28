const db = require('./db');

db.FetchCommandText("!discord", function(result) {
  console.log(result);
});
