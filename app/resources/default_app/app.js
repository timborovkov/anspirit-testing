var app = require('app')
var BrowserWindow = require('browser-window')
var ipc = require('ipc');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('~/storage');

app.on('ready', function(){

  var win = new BrowserWindow({
     show: false,
     resizable: true,
     fullscreen: true
   })
  win.webContents.openDevTools();
  win.loadURL('file://' + __dirname + '/html/start.html');
  win.show();

  win.on('closed', function() {
    app.quit();
  });

  ipc.on('appQuit', function(){
    app.quit();
  });
})
