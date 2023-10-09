const url = "http://127.0.0.1:5000/api/v1.0/airquality_data";
const coordinate = {"type": "Point", "coordinates": [-119.39, 58.49]}; // longitude and latitude
var json_data = {"type": "FeatureCollection","features":[]};

function convert_2geojson(data) {
    // convert data intp geojson format
    for(let i = 0; i < data.length; i++) {
        json_data.features.push({
          "type": "Feature",
          "geometry": coordinate,
          "properties": {
            'aqi': data[i]['aqi'],
            'time': data[i]['date']
          }
        })
    };
};


function addGeoJSONLayer(map, data) {
    var geoJSONLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latLng) {
            // use different color on different aqi
            var color = "#00ffbc"; // green
            if (feature.properties.aqi == '2') {
                color = "#ffff00"; // yellow
            } else if (feature.properties.aqi == '3') {
                color = "#ffb100"; // orange
            } else if (feature.properties.aqi == '4') {
                color = "#ff7300"; // light red
            } else if (feature.properties.aqi == '5') {
                color = "#ff0000"; // red
            }
            var pointIcon = {
              radius: 18575,
              fillColor: color,
              color: color,
              weight: 0.5,
              opacity: 0.5,
              fillOpacity: 0.5
            }

            return L.circle(latLng, pointIcon);
        }
    });

    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
        updateTimeDimension: true,
        duration: 'PT2M',
        updateTimeDimensionMode: 'replace',
        addlastPoint: false
    });

    geoJSONTDLayer.addTo(map);
}

// Fetch the JSON data
d3.json(url).then(function(data) {
  convert_2geojson(data);

  var map = L.map('map', {
      zoom: 6,
      fullscreenControl: true,
      timeDimensionControl: true,
      timeDimensionControlOptions: {
          timeSliderDragUpdate: true,
          loopButton: true,
          autoPlay: true,
          playerOptions: {
              transitionTime: 1000,
              loop: false
          }
      },
      timeDimension: true,
      center: [58.49, -119.39]
  });

  var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  });
  osmLayer.addTo(map);

  // Render aqi data layer
  addGeoJSONLayer(map, json_data)


  var aqiLevelLayer = L.control({
    position: 'bottomright'
  });

  aqiLevelLayer.onAdd = function() {
      var div = L.DomUtil.create('div', 'indexLevel');
      div.innerHTML += '<ul><li class="aqi1">aqi 1</li><li class="aqi2">aqi 2</li><li class="aqi3">aqi 3</li><li class="aqi4">aqi 4</li><li class="aqi5">aqi 5</li></ul>';
      return div;
  };

  aqiLevelLayer.addTo(map);
});
