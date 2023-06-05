var drivingmap = L.map('drivingmap').setView([47.751076, -120.740135], 7.45);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-night-v1',
    accessToken: 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw',
}).addTo(drivingmap);
var control = L.Routing.control({
  waypoints: [
              null
    //L.latLng(47.246587, -122.438830),
    //L.latLng(47.318017, -122.542970),
    //L.latLng(47.258024, -122.444725)
  ],
    routeWhileDragging: true,
    router: L.Routing.mapbox('pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw'),
    units:'imperial',
    collapsible: true,
    show: false,
    geocoder: L.Control.Geocoder.photon(),
}).addTo(drivingmap);

// create pop-up to for ‘start from this location’ or ‘go to this location’ buttons
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

drivingmap.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(drivingmap);
    // add location for first waypoint
    L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        drivingmap.closePopup();
    });
    // add location for destination button
    L.DomEvent.on(destBtn, 'click', function() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    control.show();
    drivingmap.closePopup();
    });
 });

 L.Control.textbox = L.Control.extend({
 		onAdd: function(map) {

 		var text = L.DomUtil.create('div');
 		text.id = "info_text";
 		text.innerHTML =
    "<strong> Map Instructions: Click on desired starting location. When prompted, click the 'Start from this location' button to set starting point. <br> Next, find desired destination on map, click with mouse pointer, and select 'Go to this location' when prompted.</strong>"
 		return text;
 		},

 		onRemove: function(map) {
 			// Nothing to do here
 		}
 	});
 	L.control.textbox = function(opts) {return new L.Control.textbox(opts);}
 	L.control.textbox({position:'bottomleft'}).addTo(drivingmap);
