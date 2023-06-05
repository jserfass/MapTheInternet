mapboxgl.accessToken = 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [-120.740135, 47.751076], // starting position [lng, lat]
zoom: 6.25, // starting zoom
pitch: 85,
//bearing: 80,
projection: 'globe', //globe projection rather than the default web mercator
attributionControl: false
});
//listener => replaces function
map.on('load', () => {
     // add the state boundary file
     map.addSource('statebounds', {
        type: 'geojson',
        data: 'data/WA_State_Boundary.geojson',
    });
    // Load an image from an external URL.
    map.loadImage(
        'mountain.png',
        (error, image) => {
            if (error) throw error;
            // Add the image to the map style.
            map.addImage('mountain', image);})

    // add the peaks layer
    map.addSource('peaks', {
        type: 'geojson',
        data: 'data/peaks.geojson',
    });
    map.addLayer({
      'id': 'WA Peaks',
      'type': 'symbol',
      'source': 'peaks',
      'layout': {
        'icon-image': 'mountain', // reference the image
        'icon-size': 0.25},
        // Make the layer visible by default.
        'visibility': 'visible',
    });

    map.addLayer({
      'id': 'WA State Boundary',
      'type': 'line',
      'source': 'statebounds',
      'layout': {
        // Make the layer visible by default.
        'visibility': 'visible',
        },
      'paint': {
          'line-width': 6,
          'line-color': 'darkblue',
          'line-opacity': .6,
      }
    });

    // Add a source for the routes feature class.
    map.addSource('routes', {
        type: 'geojson',
        data: 'data/routes.geojson' 
    });
    map.addLayer({
      'id': 'Summit Routes',
      'type': 'line',
      'source': 'routes',
      'layout': {
        // Make the layer visible by default.
        'visibility': 'visible'
        },
      'paint': {
          'line-width': 3,
          'line-color': ['match', ['get', 'ROUTE'],
          '5', 'red',
          '4', 'orange',
          '3', 'yellow',
          '2', 'light green',
          '1', 'green',
          /*else,*/'purple',
      ]
      }
    });  
    // add the nps boundary lines
    map.addSource('npsline', {
        type: 'geojson',
        data: 'data/npsline.geojson'
    });
    map.addLayer({
      'id': 'NPS line',
      'type': 'line',
      'source': 'npsline',
      'layout': {
        // Make the layer visible by default.
        'visibility': 'visible',
        },
      'paint': {
          'line-width': 2.5,
          'line-color': 'maroon',
          'line-opacity': .4,
      }
    });
    // add the usfs boundary lines
    map.addSource('usfsline', {
        type: 'geojson',
        data: 'data/usfsline.geojson'
    });
    map.addLayer({
      'id': 'USFS line',
      'type': 'line',
      'source': 'usfsline',
      'layout': {
        // Make the layer visible by default.
        'visibility': 'visible',
        },
      'paint': {
          'line-width': 2.5,
          'line-color': 'lime',
          'line-opacity': .4,
      }
    });
    // add the nps boundary polygon
    map.addSource('npspoly', {
        'type': 'geojson',
        'data':'data/npspoly.geojson'
    });
    map.addLayer({
        'id': 'NPS Boundary',
        'type': 'fill',
        'source': 'npspoly', // reference the data source
        'layout': {
           // Make the layer visible by default.
           'visibility': 'visible',  
        },
        'paint': {
        'fill-color': 'maroon', // maroon color fill
        'fill-opacity': 0.2
        }
        });
    // add the usfs boundary polygon
    map.addSource('usfspoly', {
        'type': 'geojson',
        'data':'data/usfspoly.geojson'
    });
    map.addLayer({
        'id': 'USFS Boundary',
        'type': 'fill',
        'source': 'usfspoly', // reference the data source
        'layout': {
           // Make the layer visible by default.
           'visibility': 'visible',  
        },
        'paint': {
        'fill-color': 'lime', // green color fill
        'fill-opacity': 0.2
        }
        });
    // Adding a control to let the user adjust their view
    const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true
    });
    map.addControl(navControl, 'top-right');
    // Adding Geo Location
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }));
    // Adding Scale Control
    const scale = new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: 'miles'
    });
    map.addControl(scale);
    scale.setUnit('imperial');
    // Adding Attribution Control
    map.addControl(new mapboxgl.AttributionControl
        ({customAttribution: 'Map design by Joshua Serfass, Data Retrieved From: https://public-nps.opendata.arcgis.com/, Background Photo: Joshua Serfass',
          compact: true,
        }))
    });

// When a click event occurs on a feature in the trails layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'Summit Routes', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Route Name: </b>" + e.features[0].properties.Descript + "<br><b>YDS Class: </b>" + e.features[0].properties.ROUTE + 
    "<br><b>Trail Length (Miles): </b>" + e.features[0].properties.MILES + "<br><b>Elevation Gain (Feet): </b>" + e.features[0].properties.GAIN)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'Summit Routes', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Summit Routes', () => {
    map.getCanvas().style.cursor = '';
    });

// When a click event occurs on a feature in the Peaks layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'WA Peaks', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Peak Name: </b>" + e.features[0].properties.NAME + "<br><b>Summit Elevation (Feet): </b>" + e.features[0].properties.ELEV_FEET + 
    "<br><b>Prominence: </b>" + e.features[0].properties.PROMINENCE + "<br><b>County: </b>" + e.features[0].properties.COUNTY)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'WA Peaks', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'WA Peaks', () => {
    map.getCanvas().style.cursor = '';
    });


// add terrain layer
map.on('load', function () {
    map.addSource('mapbox-dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
        'tileSize': 512,
        'maxzoom': 15,
    });
     map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.5})
     map.setFog({
        'range': [-1, 2],
        'horizon-blend': 0.8,
        'color': 'white',
        'high-color': '#add8e6',
        'space-color': '#d8f2ff',
        'star-intensity': 0.0
    });
    });
// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {    
    // If these two layers were not added to the map, abort
    if (!map.getLayer('Summit Routes') || !map.getLayer('WA State Boundary')|| !map.getLayer('NPS Boundary')|| !map.getLayer('USFS Boundary')) {
    return;
    }


    // Enumerate ids of the layers.
    const toggleableLayerIds = ['Summit Routes', 'WA State Boundary', 'NPS Boundary', 'USFS Boundary'];
 
    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }
    
        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'active';
        
        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();
        
            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
        );
        
        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
        };    
        
            const layers = document.getElementById('menu');
            layers.appendChild(link);
        }
});
