
var labels = 'improvethismap';
var labelIndex = 0;
var markers = [];
var contentString;
var map;
var newlat;
var newlng;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    
    center: {lat: 33.7756, lng: -84.3963},
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
  getAllPinDown();
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

function showSuggestions(userId) {
  $.ajax({
        url:'http://bda7007d.ngrok.io/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
            +encodeURIComponent(userId),
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(getData) {
          contentString = '<div id="content">'+
              '</div>'+'<a onclick=suggestion('+getData.improvementId+')> Title: '+getData.title+'</a>'+
              '<div id="bodyContent">'+
              '</br>'+'Location: '+getData.location+
              '</br>'+'Discription: '+getData.description+
              '</br>'+'Likes: '+getData.upvotes+
            '</div>';
        },
        error: function() {
                alert('error loading data(main)');
        }
  });
}

function getLat() {
  return newlat;
}
function getLng() {
  return newlng;
}
function suggestion(improvementId) {
   console.log(improvementId);
   sessionStorage.setItem("list",improvementId);
   window.location = "./confirmidea.html";
}
