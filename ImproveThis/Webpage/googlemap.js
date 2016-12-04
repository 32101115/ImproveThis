
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var newlat;
var newlng;
var map;
var markers = [];
var marker;
var contentString;
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

function pinDown(lat, lng, userId) {
  var myLatLng = {lat, lng};
  // var marker = new google.maps.Marker({
  //   position: myLatLng,
  //   map: map
  // });
  showSuggestions(userId);
  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });
  //markers.push(marker);
  markers[userId] = new google.maps.Marker({
           position: myLatLng,
           map: map,
   });
      markers[userId].addListener('click', function() {
      infowindow.open(map, markers[userId]);
      console.log(userId);

  });

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

function showSuggestions(userId) {
  $.ajax({
        url:'http://bda7007d.ngrok.io/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
            +encodeURIComponent(userId),
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(getData) {
          contentString = '<div id="content">'+
              '</div>'+'<a onclick=#> Title: '+getData.title+'</a>'+
              '<div id="bodyContent">'+
            '</div>';
        },
        error: function() {
                alert('error loading data(main)');
        }
  });
}


