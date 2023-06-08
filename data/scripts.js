mapboxgl.accessToken = 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
center: [0, 0], // starting position [lng, lat]
zoom: 1.75, // starting zoom
pitch: 0,
//bearing: 80,
attributionControl: false,
maxBounds: [
  [-180, -85], // Southwest coordinates
  [180, 85] // Northeast coordinates
  ],
});
//listener => replaces function
map.on('load', () => {
 // Add a source for the data centers feature class.
 map.addSource('DataCenters', {
    type: 'geojson',
    data: 'data/Data_Center_Final.geojson'
  });
  map.addLayer({
    'id': 'US Data Centers',
    'type': 'circle',
    'source': 'DataCenters',
    'paint': {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'Data_Generated_Per_Day__TB_'],
        0, 8,
        100, 10,
        400, 20,
        800, 30,
        1536, 40,
        2560, 50
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'Data_Generated_Per_Day__TB_'],
        0, 'blue',
        100, 'green',
        400, 'yellow',
        800, 'orange',
        1536, 'red',
        2560, 'purple'
      ],
      'circle-blur': 0.5,
      'circle-opacity': 0.8,
      'circle-stroke-width': 0.5,
      'circle-stroke-color': 'yellow'
    },
    'layout': {
      'visibility': 'visible'
    }
  });
  
  
// Add a source for the rivers feature class.
map.addSource('rivers', {
    type: 'geojson',
    data: 'data/Rivers.geojson' 
  });
  
  map.addLayer({
    'id': 'Major Rivers',
    'type': 'line',
    'source': 'rivers',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-width': [
        'case',
        ['>', ['get', 'miles'], 500], 2, // rivers longer than 500 miles get a width of 2
        ['>', ['get', 'miles'], 750], 3, // rivers longer than 750 miles get a width of 3
        ['>', ['get', 'miles'], 1000], 4, // rivers longer than 1000 miles get a width of 4
        ['>', ['get', 'miles'], 1500], 5, // rivers longer than 1500 miles get a width of 5
        1 // default width for shorter rivers
      ],
      'line-color': '#2F80ED', // water blue color
      'line-opacity': 0.8
    }
  });

// Add a source for the data feature class.
map.addSource('data', {
    type: 'geojson',
    data: 'data/Data_Travel.geojson' 
});

map.addLayer({
    'id': 'Data Travel',
    'type': 'line',
    'source': 'data',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-width': 6.5,
      'line-color': 'yellow',
      'line-opacity': 0.8
    },
    'minzoom': 1,
    'maxzoom': 4,
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

// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {    
  // If these two layers were not added to the map, abort
  if (!map.getLayer('US Data Centers') || !map.getLayer('Major Rivers')|| !map.getLayer('Data Travel')) {
  return;
  }


  // Enumerate ids of the layers.
  const toggleableLayerIds = ['US Data Centers', 'Major Rivers', 'Data Travel',];

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

// When a click event occurs on a feature in the trails layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'Major Rivers', (e) => {
    const length = e.features[0].properties.MILES.toFixed(1);
    let description = "<b>River Name: </b>" + e.features[0].properties.NAME + "<br>";
    if (length > 2414.06 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Great River<br>";
    } else if (length > 1609.34 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Major River<br>";
    } else if (length > 1207.01 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Medium River<br>";
    } else if (length > 804.672 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Small River<br>";
    } else {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Tiny River<br>";
    }
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(map);
});
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'Major Rivers', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Major Rivers', () => {
    map.getCanvas().style.cursor = '';
    });

    map.on('click', 'US Data Centers', (e) => {
      new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML("<b>Center Name: </b>" + e.features[0].properties.Company + "<br><b>Location: </b>" + e.features[0].properties.Data_Center_Location + 
          "<br><b>Data Generated Daily (tb): </b>" + e.features[0].properties.Data_Generated_Per_Day__TB_ + "<br><b>Equivalent Data Amount in DVDs: </b>" + e.features[0].properties.Data_Equivalent__DVDs_ + "<br><b>Continents Served: </b>" + e.features[0].properties.Continents_served)
          .addTo(map);},);

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['US Data Centers'] });
  
      if (!features.length) {
        ['Douglas Travel', 'Continents', 'Center', 'Continent-label', 'Maiden Travel', 'Altoona Travel', 'Ashburn Travel', 'Atlanta Travel', 'Chicago Travel', 'Council Travel', 'Dallas Travel', 'Douglas Travel', 'Dublin Travel', 'Fishkill Travel', 'Phoenix Travel', 'Portland Travel', 'Round Travel', 'San Jose Travel', 'Quincy Travel', 'Four'].forEach(function(id) {
          if (map.getLayer(id)) {
              map.removeLayer(id);
          }
      });

      ['Douglas Travel', 'Continents', 'Center', 'Continent-label', 'Maiden Travel', 'Altoona Travel', 'Ashburn Travel', 'Atlanta Travel', 'Chicago Travel', 'Council Travel', 'Dallas Travel', 'Douglas Travel', 'Dublin Travel', 'Fishkill Travel', 'Phoenix Travel', 'Portland Travel', 'Round Travel', 'San Jose Travel', 'Quincy Travel', 'Four'].forEach(function(id) {
          if (map.getSource(id)) {
              map.removeSource(id);
          }
      });

          return;
      }
    
      var feature = features[0];
  
      if (feature.properties.Location === 'Douglas County, Georgia') {
          map.addSource('Douglas Travel', {
              type: 'geojson',
              data: 'data/DouglasTravel.geojson'
          });
          map.addLayer({
              id: 'Douglas Travel',
              type: 'line',
              source: 'Douglas Travel',
              layout: {
                  visibility: 'visible'
              },
              paint: {
                  'line-width': 6.5,
                  'line-color': 'yellow',
                  'line-opacity': 0.8
              }
          });
          map.addSource('Continents', {
              type: 'geojson',
              data: 'data/World_Continents.geojson'
          });
          map.addLayer({
              id: 'Continents',
              type: 'fill',
              source: 'Continents', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': [
                    'match',
                    ['get', 'CONTINENT'],
                    'North America', '#FF0000',
                    'South America', '#00FF00',
                    'Europe', '#0000FF',
                    'Asia', '#FFFF00',
                    'Africa', '#00FFFF',
                    'Australia', '#FF00FF',
                    'Antarctica', '#FFFFFF',
                    '#CCCCCC' // default color
                ],
                'fill-opacity': 0.2
            }
          });

          map.addSource('NorthAmerica', {
            type: 'geojson',
            data: 'data/NorthAmericaPoly.geojson'
          });
          map.addLayer({
              id: 'North America',
              type: 'fill',
              source: 'North America', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#FF0000',
                'fill-opacity': 0.2
            }
          });

          map.addSource('SouthAmerica', {
            type: 'geojson',
            data: 'data/SouthAmericaPoly.geojson'
          });
          map.addLayer({
              id: 'South America',
              type: 'fill',
              source: 'South America', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#00FF00',
                'fill-opacity': 0.2
            }
          });

          map.addSource('Europe', {
            type: 'geojson',
            data: 'data/EuropePoly.geojson'
          });
          map.addLayer({
              id: 'Europe',
              type: 'fill',
              source: 'Europe', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#0000FF',
                'fill-opacity': 0.2
            }
          });

          map.addSource('Asia', {
            type: 'geojson',
            data: 'data/AsiaPoly.geojson'
          });
          map.addLayer({
              id: 'Asia',
              type: 'fill',
              source: 'Asia', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#FFFF00',
                'fill-opacity': 0.2
            }
          });

          map.addSource('Africa', {
            type: 'geojson',
            data: 'data/AfricaPoly.geojson'
          });
          map.addLayer({
              id: 'Africa',
              type: 'fill',
              source: 'Africa', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#00FFFF',
                'fill-opacity': 0.2
            }
          });

          map.addSource('Australia', {
            type: 'geojson',
            data: 'data/AustraliaPoly.geojson'
          });
          map.addLayer({
              id: 'Australia',
              type: 'fill',
              source: 'Australia', 
              layout: {
                  visibility: 'visible'
              },
              paint: {
                'fill-color': '#FF00FF',
                'fill-opacity': 0.2
            }
          });

          map.addSource('Center', {
              type: 'geojson',
              data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
              id: 'Center',
              type: 'circle',
              source: 'Center',
              paint: {
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['get', 'SqFt'],
                      0, 4,
                      100000, 5,
                      500000, 10,
                      1000000, 15,
                      2000000, 20,
                      5000000, 25
                  ],
                  'circle-color': '#39FF14',  
                  'circle-blur': 0.5,
                  'circle-opacity': 0.8,
                  'circle-stroke-width': .5,
                  'circle-stroke-color': 'yellow'
              },
              layout: {
                  visibility: 'visible'
              }
          });
          map.addLayer({
              id: 'Continent-label',
              type: 'symbol',
              source: 'Center',
              layout: {
                  'text-field': ['get', 'Continent'],
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top'
              },
              paint: {
                  'text-color': '#ffffff'
              }
          });
      }  
      else if (feature.properties.Location === 'Maiden, North Carolina') {
        map.addSource('Maiden Travel', {
          type: 'geojson',
          data: 'data/MaidenTravel.geojson'
        });  
        map.addLayer({
          id: 'Maiden Travel',
          type: 'line',
          source: 'Maiden Travel',
          layout: {
              visibility: 'visible'
          },
          paint: {
              'line-width': 6.5,
              'line-color': 'yellow',
              'line-opacity': 0.8
          }
        });
        map.addSource('Continents', {
          type: 'geojson',
          data: 'data/World_Continents.geojson'
        });
        map.addLayer({
          id: 'Continents',
          type: 'fill',
          source: 'Continents', 
          layout: {
              visibility: 'visible'
          },
          paint: {
            'fill-color': [
                'match',
                ['get', 'CONTINENT'],
                'North America', '#FF0000',
                'South America', '#00FF00',
                'Europe', '#0000FF',
                'Asia', '#FFFF00',
                'Africa', '#00FFFF',
                'Australia', '#FF00FF',
                'Antarctica', '#FFFFFF',
                '#CCCCCC' // default color
            ],
            'fill-opacity': 0.2
        }
        });
        map.addSource('Center', {
          type: 'geojson',
          data: 'data/ContinentCenter.geojson'
        });
        map.addLayer({
          id: 'Center',
          type: 'circle',
          source: 'Center',
          paint: {
              'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['get', 'SqFt'],
                  0, 4,
                  100000, 5,
                  500000, 10,
                  1000000, 15,
                  2000000, 20,
                  5000000, 25
              ],
              'circle-color': '#39FF14',  
              'circle-blur': 0.5,
              'circle-opacity': 0.8,
              'circle-stroke-width': .5,
              'circle-stroke-color': 'yellow'
          },
          layout: {
              visibility: 'visible'
          }
        });
        map.addLayer({
          id: 'Continent-label',
          type: 'symbol',
          source: 'Center',
          layout: {
              'text-field': ['get', 'Continent'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
          },
          paint: {
              'text-color': '#ffffff'
          }
        });
      }
        else if (feature.properties.Location === 'Altoona, Iowa') {
          map.addSource('Altoona Travel', {
            type: 'geojson',
            data: 'data/AltoonaTravel.geojson'
          });  
          map.addLayer({
            id: 'Altoona Travel',
            type: 'line',
            source: 'Altoona Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Continents', {
            type: 'geojson',
            data: 'data/World_Continents.geojson'
          });
          map.addLayer({
            id: 'Continents',
            type: 'fill',
            source: 'Continents', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Council Bluffs, Iowa') {
          map.addSource('Council Travel', {
            type: 'geojson',
            data: 'data/CouncilTravel.geojson'
          });  
          map.addLayer({
            id: 'Council Travel',
            type: 'line',
            source: 'Council Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Continents', {
            type: 'geojson',
            data: 'data/World_Continents.geojson'
          });
          map.addLayer({
            id: 'Continents',
            type: 'fill', 
            source: 'Continents', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Atlanta, Georgia') {
          map.addSource('Atlanta Travel', {
            type: 'geojson',
            data: 'data/AtlantaTravel.geojson'
          });  
          map.addLayer({
            id: 'Atlanta Travel',
            type: 'line',
            source: 'Atlanta Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Americas', {
            type: 'geojson',
            data: 'data/AmericasPoly.geojson'
          });
          map.addLayer({
            id: 'Americas',
            type: 'fill', 
            source: 'Americas', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Dallas, Texas') {
          map.addSource('Dallas Travel', {
            type: 'geojson',
            data: 'data/DallasTravel.geojson'
          });  
          map.addLayer({
            id: 'Dallas Travel',
            type: 'line',
            source: 'Dallas Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Americas', {
            type: 'geojson',
            data: 'data/AmericasPoly.geojson'
          });
          map.addLayer({
            id: 'Americas',
            type: 'fill', 
            source: 'Americas', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Round Rock, Texas') {
          map.addSource('Round Travel', {
            type: 'geojson',
            data: 'data/RoundRockTravel.geojson'
          });  
          map.addLayer({
            id: 'Round Travel',
            type: 'line',
            source: 'Round Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Chicago, Illinois') {
          map.addSource('Chicago Travel', {
            type: 'geojson',
            data: 'data/ChicagoTravel.geojson'
          });  
          map.addLayer({
            id: 'Chicago Travel',
            type: 'line',
            source: 'Chicago Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Phoenix, Arizona') {
          map.addSource('Phoenix Travel', {
            type: 'geojson',
            data: 'data/PhoenixTravel.geojson'
          });  
          map.addLayer({
            id: 'Phoenix Travel',
            type: 'line',
            source: 'Phoenix Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Portland, Oregon') {
          map.addSource('Portland Travel', {
            type: 'geojson',
            data: 'data/PortlandTravel.geojson'
          });  
          map.addLayer({
            id: 'Portland Travel',
            type: 'line',
            source: 'Portland Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Dublin, Ohio') {
          map.addSource('Dublin Travel', {
            type: 'geojson',
            data: 'data/DublinTravel.geojson'
          });  
          map.addLayer({
            id: 'Dublin Travel',
            type: 'line',
            source: 'Dublin Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'San Jose, California') {
          map.addSource('San Jose Travel', {
            type: 'geojson',
            data: 'data/SanJoseTravel.geojson'
          });  
          map.addLayer({
            id: 'San Jose Travel',
            type: 'line',
            source: 'San Jose Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Ashburn, Virginia') {
          map.addSource('Ashburn Travel', {
            type: 'geojson',
            data: 'data/AshburnTravel.geojson'
          });  
          map.addLayer({
            id: 'Ashburn Travel',
            type: 'line',
            source: 'Ashburn Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'East Fishkill, New York') {
          map.addSource('Fishkill Travel', {
            type: 'geojson',
            data: 'data/FishkillTravel.geojson'
          });  
          map.addLayer({
            id: 'Fishkill Travel',
            type: 'line',
            source: 'Fishkill Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
        else if (feature.properties.Location === 'Quincy, Washington') {
          map.addSource('Quincy Travel', {
            type: 'geojson',
            data: 'data/QuincyTravel.geojson'
          });  
          map.addLayer({
            id: 'Quincy Travel',
            type: 'line',
            source: 'Quincy Travel',
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-width': 6.5,
                'line-color': 'yellow',
                'line-opacity': 0.8
            }
          });
          map.addSource('Four', {
            type: 'geojson',
            data: 'data/FourPoly.geojson'
          });
          map.addLayer({
            id: 'Four',
            type: 'fill', 
            source: 'Four', 
            layout: {
                visibility: 'visible'
            },
            paint: {
              'fill-color': [
                  'match',
                  ['get', 'CONTINENT'],
                  'North America', '#FF0000',
                  'South America', '#00FF00',
                  'Europe', '#0000FF',
                  'Asia', '#FFFF00',
                  'Africa', '#00FFFF',
                  'Australia', '#FF00FF',
                  'Antarctica', '#FFFFFF',
                  '#CCCCCC' // default color
              ],
              'fill-opacity': 0.2
          }
          });
          map.addSource('Center', {
            type: 'geojson',
            data: 'data/ContinentCenter.geojson'
          });
          map.addLayer({
            id: 'Center',
            type: 'circle',
            source: 'Center',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'SqFt'],
                    0, 4,
                    100000, 5,
                    500000, 10,
                    1000000, 15,
                    2000000, 20,
                    5000000, 25
                ],
                'circle-color': '#39FF14',  
                'circle-blur': 0.5,
                'circle-opacity': 0.8,
                'circle-stroke-width': .5,
                'circle-stroke-color': 'yellow'
            },
            layout: {
                visibility: 'visible'
            }
          });
          map.addLayer({
            id: 'Continent-label',
            type: 'symbol',
            source: 'Center',
            layout: {
                'text-field': ['get', 'Continent'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#ffffff'
            }
          });    
        }
    });
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'US Data Centers', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'US Data Centers', () => {
    map.getCanvas().style.cursor = '';
    }); 
