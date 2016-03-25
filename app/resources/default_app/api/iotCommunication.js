(function(){
  var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('~/storage');

  module.exports.getUserDeviceList = function(userId){

  }
  module.exports.getUserHubList = function(userId){

  }
  module.exports.getStateForDevice = function(deviceId){

  }
  module.exports.setStateForDevice = function(state, deviceId){
    /*
      1. Get POST {userId, secret, state, device}
      2. Verify user
      3. Check if this is users hub
      4. Set state for connected device
      5. Update state in database
    */
    $.ajax({
      type: 'get',
      url: 'http://api.anspirit.net/devices',
      data: {task: {state: state, device: deviceId}, secret: qapi.getUserSecret(), user: qapi.getUserId()},
      success: function(data){
        console.log("Data from hub: " + data);
        toRet.done = true;
        global.qSay("Done", function(){});
        cb(toRet);
      },
      error: function(a, error) {
        cb(toRet);
        console.error(error);
      }
    });
  }
  module.exports.getNearestHub = function(callback){
    $.ajax({
      type: "post",
      url:  qapi.getServer() + "/getUserHubList.php",
      data: {'id': qapi.getUserId(), 'password': localStorage.getItem('pass')},
      dataType: 'json',
      success: function(data){
        var userHubList = data.hubList;
        var userHubs = [];
        for (var i = 0; i < userHubList.length; i++){
          userHubs.push({'latitude': userHubList[i].latitude, 'longitude': userHubList[i].longitude});
        }
        qapi.getUserLocation(function(position){
          var latitude = position['coords']['latitude'];
          var longitude = position['coords']['longitude'];
          var hubsSortedByDistance = geolib.orderByDistance({latitude: latitude, longitude: longitude}, userHubs);
          var nearestId = hubsSortedByDistance[0].key;
          var hubData = userHubList[nearestId];
          callback(hubData);
        });
      },
      error: function(a, error){
        console.error(error);
      }
    });
  }
})();
