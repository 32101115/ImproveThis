
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var newlat;
var newlng;
var map;
var markers = [];

function initMap() {
  var gt = {lat: 33.7756, lng: -84.3963};
  map = new google.maps.Map(document.getElementById('map'), {
    
    center: gt,
    zoom: 17,
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });

  // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
    newlat = event.latLng.lat();
    newlng = event.latLng.lng();
    addMarker(event.latLng, map);
  });
}

function getLat() {
  return newlat;
}
function getLng() {
  return newlng;
}


// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
  position: location,
  label: labels[labelIndex++ % labels.length],
  map: map
  });

}

function pinDown(lat, lng) {
  /*var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.7756, lng: -84.3963},
    zoom: 17,
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });*/
  var myLatLng = {lat, lng};
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
          markers.push(marker);

}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
    setMapOnAll(null);
            markers = [];
}



