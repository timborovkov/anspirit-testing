(function(){
  var arduino = require("./arduino.js");

  module.exports.getNearestHub = function(callback){
    $.ajax({
      type: "get",
      url:  qapi.getServer() + "/getUserHubList.php",
      data: {'id': qapi.getUserId()},
      dataType: 'json',
      success: function(data){
        var userHubList = JSON.parse(data['hubList']);
        var userHubs = [];
        for (var i = 0; i < userHubList.length; i++) {
          userHubs.push(userHubList[i].position);
        }
        qapi.getUserLocation(function(position){
          var hubsSortedByDistance = geolib.orderByDistance({latitude: position['coords']['latitude'], longitude: position['coords']['longitude']}, userHubs);
          var nearestId = hubsSortedByDistance[0].key;
          var hubData = userHubList[nearestId];
          callback(hubData);
        })
      },
      error: function(a, error){
        console.error(error);
      }
    });
  }
  module.exports.addDevice = function(user){
    //TODO add new device on hub side
    //Ps. Don't contact server, cause server will send this.
  }
  module.exports.removeDevice = function(user){
    //TODO delete device from hub
    //Ps. Don't contact server, cause server will send this.
  }
  module.exports.processRequestForDevice = function(device, request) {
    //TODO process request.
    //Main hub processing

    //1. Get device type from database
    //Contacting API server
    $.ajax({
      type: "post",
      url: "api.anspirit.net/deviceType",
      data: {device: 1},
      dataType: 'json',
      success: function(data){
        var deviceType = data.deviceType;
        var connectionType = data.connectionType;

        //2. Convert message for device type
        $.getJSON( "../connections.json", function(data) {
          var device = data[deviceType];
          var commands = device[connectionType];
          var command = commands[request];

          //Here we already have device, it's connection type, message.
          //Now we must use all this data

          switch (connectionType) {
            case "zigbee":
              //Send request to Zigbee device
              
              break;
            case "x10":
              //Send request to 433mhz device
              break;
            case "zwave":
              //Send request to Z-Wave device
              break;
          }

        });

      },
      error: function(a, error){
        console.error(error);
      }
    });
  }
})();
