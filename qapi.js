(function(){
	//TODO Install packages
	var $ = require('jquery');
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('../storage');

	String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

	module.exports.getUserSecret = function(){
		return localStorage.getItem('tokenCode');
	}
	module.exports.getServer = function(){
		return localStorage.getItem("QServer");
	}
	module.exports.getUserLocation = function(callback){
		getUserLocation(callback);
	}
	module.exports.loadScript = function(url, callback){
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
	}

	function getUserLocation(callback) {
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(callback);
		}
		//position.coords.longitude
		//position.coords.latitude
	}
})();
