
var labels = 'improvethismap';
var labelIndex = 0;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    
    center: {lat: 33.7756, lng: -84.3963},
    zoom: 17,
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });

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
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.7756, lng: -84.3963},
    zoom: 17,
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });
  var myLatLng = {lat, lng};
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
}



