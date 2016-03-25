module.exports.accessForUser = function(user, secret, callback){
  var mysql = require('mysql');
  var db = mysql.createConnection({
    host     : 'eu-cdbr-azure-north-d.cloudapp.net',
    user     : 'b2a32c755154bf',
    password : 'c0b4e78d',
    database : 'anspiritMain'
  });
  db.connect();
  console.log("SELECT * FROM `users` WHERE `id`="+user+" AND `tokenCode`='"+secret+"'");
  db.query("SELECT * FROM `users` WHERE `id`="+user+" AND `tokenCode`='"+secret+"'", function(err, rows, fields) {
    if (err) throw err;
    if(rows[0] != null){
      //User is real
      //TODO check if user is hub owner
      callback(true);
    }else{
      callback(false);
    }
  });
  db.end();
}
