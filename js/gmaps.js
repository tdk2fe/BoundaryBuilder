var poly;
var map;
var defaultCenter;

var listeners = [
	'mapclicks',
	'markerclicks'
];

var markers = [];

function initialize() {
	google.maps.visualRefresh = true;

		//Using W3C Geolocation Standard
	if(navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			map.setCenter(initialLocation);

			var infoWindow = new google.maps.InfoWindow({
				map: map,
				position: initialLocation,
				content: 'Here you are!'
			});

			map.setCenter(initialLocation);
		}, function() {
			handleNoGeolocation(browserSupportFlag);
		});
	}
	//No browser support for W3C standard
	else {
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}
	
	var mapOptions = {
		//center: new google.maps.LatLng(38,-92),
		//center: initialLocation,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);

	var lineSymbol = {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		strokeColor: '#E94100',
		strokeWeight: 1.2,
		scale: 3
	};

	var polyOptions = {
		strokeColor: '#000000',
		strokeOpacity: 0,
		strokeWeight: .5,
		icons: [{
			icon: lineSymbol,
			offset: '0',
			repeat: '10px'
		}]
	};

	poly = new google.maps.Polyline(polyOptions);
	poly.setMap(map);

	listeners['mapclicks'] = google.maps.event.addListener(map, 'click', addLatLng);

	document.getElementById("clearmap").disabled = true;
}

function addLatLng(event) {
	var path = poly.getPath();

	path.push(event.latLng);

	var image = {
		url: 'images/marker.png',
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(6,6)
	}

	var marker = new google.maps.Marker({
		position: event.latLng,
		title: '#' + path.getLength(),
		map: map,
		icon: image
	});

	markers.push(marker);
	if (markers.length == 1) {
		listeners['markerclicks'] = google.maps.event.addListener(marker, 'click', closeBoundary);
	}

	var latcord = event.latLng.lat()
	latcord = latcord.toString().slice(0,7);

	var longcord = event.latLng.lng();
	longcord = longcord.toString().slice(0,7);

	var coordlist = document.getElementById("list");

	coordlist.innerHTML += "<li>" + latcord + ", " + longcord + "</li>"

	var resetButton = document.getElementById("clearmap")
	resetButton.disabled = false;

    var encoded = google.maps.geometry.encoding.encodePath(path);
    var encodedstring = document.getElementById("encodedstring");

    encodedstring.innerHTML = encoded;


}

function handleNoGeolocation(errorFlag) {
	if (errorFlag == true) {
		var content = "Geolocation failed";
	} else {
		var content = "Geolocation not supported by your browser";
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(38,-92),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

function closeBoundary() {
	var path = poly.getPath();
	path.push(markers[0].position);
	google.maps.event.removeListener(listeners['mapclicks']);
	
	boundaryShaded = new google.maps.Polygon({
		paths: path,
		strokeColor: "#009900",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#4DB84D",
		fillOpacity: 0.5
	});
	
	boundaryShaded.setMap(map);
	
}

function setAllMap(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function clearMarkers() {

	setAllMap(null);
}

function reset() {
	var path = poly.getPath();
	path.clear();
	clearMarkers();
	markers = [];

	listeners['mapclicks'] = google.maps.event.addListener(map, 'click', addLatLng);

	var coordlist = document.getElementById("list");
	coordlist.innerHTML = "";

	var resetButton = document.getElementById("clearmap")
	resetButton.disabled = true;
}

google.maps.event.addDomListener(window, 'load', initialize);


