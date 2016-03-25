var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./storage');
$ = require('jquery');
require('jquery-ui');
var geolib = require('geolib');
(function(){
    var fs = require('fs');
    var platform = require('../api/platform.js');
    var international = require('../api/international.js');
    var qapi = require('../api/qapi.js');
    var iot = require('../api/iotCommunication.js');

    $(document).ready(function() {
        iot.getNearestHub(function(hub){
          window.NearestHub = hub;
        });
        $(".content").load("./home.html");
        //Setup UI text
        international.prepareTranslates(function(){
            document.getElementById("myExtensions_menu").innerHTML = international.getGUIText("My Extensions");
            document.getElementById("market_menu").innerHTML = international.getGUIText("Market");
            document.getElementById("home_menu").innerHTML = international.getGUIText("Home");
            document.getElementById("iot_menu").innerHTML = international.getGUIText("Home Control");
            document.getElementById("settings_menu").innerHTML = international.getGUIText("Settings");
            document.getElementById("emoji_menu").innerHTML = international.getGUIText("Emoji");
            document.getElementById("timetable_menu").innerHTML = international.getGUIText("Schedule");
            $("logout_btn").html(international.getGUIText("Logout"));
        });
        switch (qapi.GetWeatherIcon()) {
          case 'wind':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/wind.jpg\")");
            break;
          case 'rain':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/rain.jpg\")");
            break;
          case 'snow':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/snow.jpg\")");
            break;
          case 'clear-day':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/clear-day.jpg\")");
            break;
          case 'clear-night':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/clear-night.jpg\")");
            break;
          case 'fog':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/fog.jpg\")");
            break;
          case 'cloudy':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/cloudy.jpg\")");
            break;
          case 'partly-cloudy-day':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/partly-cloudy-day.jpg\")");
            break;
          case 'partly-cloudy-night':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/partly-cloudy-night.jpg\")");
            break;
          case 'sleet':
            $(".fullScreen").css( "background-image", "url(\"../pictures/weather/sleet.jpg\")");
            break;
        }

      $(".menuElement").click(function() {
        var val  = $(this).attr('id');
        switch(val) {
          case "home_menu":
            $(".content").load("./home.html");
            break;
          case "myExtensions_menu":
            $(".content").load("./myExtensions.html");
            break;
          case "market_menu":
            $(".content").load("./market.html");
            break;
          case "settings_menu":
            $(".content").load("./settings.html", function() {
              document.getElementById("name_field").value = localStorage.getItem('name');
              document.getElementById("lang_field").value = localStorage.getItem('lang');
              document.getElementById("country_field").value = localStorage.getItem('country');
            });
            break;
          case "emoji_menu":
            $(".content").load("./emoji.html");
            break;
          case "timetable_menu":
            $(".content").load("./timetable.html");
            break;
          case "iot_menu":
            $(".content").load("./iot.html", function() {
              loaded();
            });
            break;
          }
      });
      $(".logout_btn").click(function(){
        localStorage.removeItem('name')
        localStorage.removeItem('id')
        localStorage.removeItem('version')
        localStorage.removeItem('pass')
        localStorage.removeItem('email')
        localStorage.removeItem('lang')
        localStorage.removeItem('age')

        $(location).attr('href','file://' + __dirname + '/login.html')
      });
    });

    //Error handling
    process.on('uncaughtException', function (exception) {
     // handle or ignore error
    });
})();
  function newCard(content){
    var cardContent = "<br><div class='card'> " + content + " </div><br>";
    var contentNow = $(".cards").html();
    $(".cards").html(cardContent + contentNow);
  }
