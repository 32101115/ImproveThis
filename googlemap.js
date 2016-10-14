
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var createControlDiv = document.createElement('div');
  var createControl = new CreateControl(createControlDiv, map);
  var createControlDiv1 = document.createElement('div');
  var createControl1 = new CreateControl1(createControlDiv1, map);

  createControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(createControlDiv);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(createControlDiv1);
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

google.maps.event.addDomListener(window, 'load', initialize);

   

      /**
       * The CenterControl adds a control to the map that create gripe
       * This constructor takes the control DIV as an argument.
       * @constructor
       */
      function CreateControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'gray';
        //controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        //controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to create a gripe';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'white';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'create';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: 
        controlUI.addEventListener('click', function() {
        });

      }

      /**
       * The CenterControl adds a control to the map that create gripe
       * This constructor takes the control DIV as an argument.
       * @constructor
       */
      function CreateControl1(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'gray';
        //controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        //controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to create a gripe';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'white';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'create';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: 
        controlUI.addEventListener('click', function() {
        });

      }



