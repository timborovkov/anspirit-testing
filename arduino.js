var ArduinoScanner = require('arduino-scanner');
var arduinoScanner = new ArduinoScanner();

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var arduinoConnection = null;
var incomeFromArduinoProcessing = function(input){};

var portName = null;

arduinoScanner.start();

arduinoScanner.on('arduinoFound', function(response) {
  arduinoScanner.stop();
  console.log(response.message);
  portName = response.port;
  arduinoConnection = new SerialPort(portName,{
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false,
      parser: serialport.parsers.raw
    });
  arduinoConnection.on('data', function(input){
    console.log(input);
    incomeFromArduinoProcessing(input);
  });
  module.exports.send = function(data){
    arduinoConnection.write(data, function(err, results){
      console.error('err ' + err);
    });
  }
  module.exports.onDataGet = function(func){
    incomeFromArduinoProcessing = func;
  }
});

module.exports.send = function(data){
  console.log('not yet connected');
}
module.exports.onDataGet = function(func){
  console.log('not yet connected');
}
