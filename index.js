var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var iot = require('./iotServer');

app.use(bodyParser.json());
app.get('/', function(req, res){
  res.send('Hello, I am QHUB');
});

app.post('/hub', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  console.log("Hub has been requested");
  var secret = req.body.secret;
  var user = req.body.user;
  var task = req.body.task;

  if(user != null && task != null && secret != null){
    var security = require("./verifySecurity");
    security.accessForUser(user, secret, function(access){
      if(access){
        var responseToSend = {access: true, error: null};
        res.send(JSON.stringify(responseToSend));
        console.log(task);
        //TODO get device (id) to manipulate
        //TODO get requestCode Ps. standart code
        iot.processRequestForDevice(device, requestCode);
      }else{
        var responseToSend = {access: false, error: 'no access'};
        res.send(JSON.stringify(responseToSend));
      }
    });
  }else{
      res.send(JSON.stringify({error: true, type: 'bad request'}));
  }
});
app.post('/deviceSet', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  var secret = req.body.secret;
  var user = req.body.user;
  var device = req.body.device;
  var state = req.body.state;

  if(user != null && secret != null && device != null && state != null){
    var security = require("./verifySecurity");
    security.accessForUser(user, secret, function(access){
      if(access){
        var responseToSend = {access: true, error: null};
        res.send(JSON.stringify(responseToSend));
        console.log(task);
        //Process
        iot.processRequestForDevice(device, state);
      }else{
        var responseToSend = {access: false, error: 'no access'};
        res.send(JSON.stringify(responseToSend));
      }
    });
  }else{
      res.send(JSON.stringify({error: true, type: 'bad request'}));
  }
});

/*
  --- Arduino ---
*/

var arduino = require('./arduino');
arduino.onDataGet(function(data){
  console.log(data);
});
app.get('/arduino', function(req, res){
  var request = req.query.message;
  if(request != null){
    arduino.send(request);
    res.send("done");
  }else{
    res.send('No request');
  }
});

/*
  ---------------
*/

http.listen(8080, function(){
  //TODO Get hub's secret code
  console.log('listening on *:8080');
});
